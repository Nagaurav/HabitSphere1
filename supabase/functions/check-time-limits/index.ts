
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { site_url } = await req.json();

    // Get site category and time spent today
    const { data: usage } = await supabaseClient
      .from('digital_usage_logs')
      .select('site_category, time_spent_seconds')
      .eq('site_url', site_url)
      .eq('logged_date', new Date().toISOString().split('T')[0])
      .single();

    if (!usage) {
      return new Response(
        JSON.stringify({ limitExceeded: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Get time limit for this category
    const { data: limit } = await supabaseClient
      .from('time_limits')
      .select('daily_limit_seconds')
      .eq('category', usage.site_category)
      .single();

    const limitExceeded = limit && usage.time_spent_seconds >= limit.daily_limit_seconds;

    return new Response(
      JSON.stringify({ limitExceeded }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
