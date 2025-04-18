
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

    const { site_url, user_id } = await req.json();
    
    // Get the current date
    const today = new Date().toISOString().split('T')[0];
    
    // Get time spent today on this site
    const { data: usageData, error: usageError } = await supabaseClient
      .from('digital_usage_logs')
      .select('time_spent_seconds')
      .eq('site_url', site_url)
      .eq('user_id', user_id)
      .eq('logged_date', today);
      
    if (usageError) throw usageError;
    
    // Get site blocking rules
    const { data: ruleData, error: ruleError } = await supabaseClient
      .from('site_blocking_rules')
      .select('is_blocked, site_category')
      .eq('site_url', site_url)
      .eq('user_id', user_id)
      .single();
      
    if (ruleError && ruleError.code !== 'PGRST116') {
      // PGRST116 is "not found" - we'll just treat no rule as no limit
      throw ruleError;
    }
    
    // Calculate total time spent
    const totalTimeSpent = usageData?.reduce((sum, log) => sum + log.time_spent_seconds, 0) || 0;
    
    // Default time limits by category (seconds)
    const defaultTimeLimits = {
      'productive': 0, // No limit
      'neutral': 3600, // 1 hour
      'distracting': 1800 // 30 minutes
    };
    
    // Check if site is directly blocked
    const isBlocked = ruleData?.is_blocked || false;
    
    // If we have a rule, check against time limits
    const category = ruleData?.site_category || 'neutral';
    const timeLimit = defaultTimeLimits[category as keyof typeof defaultTimeLimits];
    
    // Determine if time limit is exceeded
    const limitExceeded = isBlocked || (timeLimit > 0 && totalTimeSpent >= timeLimit);
    
    return new Response(
      JSON.stringify({ 
        limitExceeded,
        timeSpent: totalTimeSpent,
        timeLimit,
        category
      }),
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
