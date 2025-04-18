
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

    const { site_url, time_spent_seconds, user_id } = await req.json();

    // Get site category from rules
    const { data: ruleData } = await supabaseClient
      .from('site_blocking_rules')
      .select('site_category')
      .eq('site_url', site_url)
      .single();

    const site_category = ruleData?.site_category || 'neutral';

    // Log the usage
    const { data, error } = await supabaseClient
      .from('digital_usage_logs')
      .insert({
        site_url,
        site_category,
        time_spent_seconds,
        user_id: user_id || '00000000-0000-0000-0000-000000000000' // Providing a default user ID if none provided
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
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
