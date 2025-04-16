
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://qmdqruppbuyutasssggx.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HabitAssistantRequest {
  action: 'habit_recommendation' | 'personalized_reminder' | 'pattern_analysis' | 'notification_timing';
  userId: string;
  habitId?: string;
  currentStreak?: number;
  timeOfDay?: string;
  userData?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the request data
    const { action, userId, habitId, currentStreak, timeOfDay, userData } = await req.json() as HabitAssistantRequest;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Initialize user context based on request action
    const userContext = await getUserContext(supabase, userId, action, habitId);
    
    if (!userContext) {
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve user context' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate the appropriate OpenAI prompt based on the action
    const promptData = generatePrompt(action, userContext, currentStreak, timeOfDay);
    
    // Call OpenAI API
    const aiResponse = await callOpenAI(promptData);
    
    // Format and return the response
    return new Response(
      JSON.stringify(aiResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in habit-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to fetch and build user context from database
async function getUserContext(supabase, userId: string, action: string, habitId?: string) {
  try {
    // Get basic user data
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (userError) throw userError;

    // Get user's habits
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId);
    
    if (habitsError) throw habitsError;

    // Get user's habit completions
    const { data: completions, error: completionsError } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', userId)
      .order('completion_date', { ascending: false })
      .limit(100);
      
    if (completionsError) throw completionsError;

    // Get user's digital usage logs
    const { data: digitalLogs, error: digitalLogsError } = await supabase
      .from('digital_usage_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_date', { ascending: false })
      .limit(30);
    
    if (digitalLogsError) throw digitalLogsError;

    // If action needs specific habit data
    let habitData = null;
    if (habitId && (action === 'personalized_reminder' || action === 'pattern_analysis')) {
      const { data: habit, error: habitError } = await supabase
        .from('habits')
        .select('*')
        .eq('id', habitId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (habitError) throw habitError;
      
      // Get the specific habit's completions
      const { data: habitCompletions, error: habitCompletionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .eq('user_id', userId)
        .order('completion_date', { ascending: false })
        .limit(30);
      
      if (habitCompletionsError) throw habitCompletionsError;
      
      habitData = {
        ...habit,
        completions: habitCompletions
      };
    }

    // Return the constructed context
    return {
      user: userData || { id: userId },
      habits: habits || [],
      completions: completions || [],
      digitalLogs: digitalLogs || [],
      specificHabit: habitData
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return null;
  }
}

// Function to generate prompt based on action type
function generatePrompt(action: string, userContext: any, currentStreak?: number, timeOfDay?: string) {
  const systemPrompt = "You are an AI habit coach that helps users build better habits. You provide encouraging, personalized advice based on user data. Be concise and actionable. Limit responses to 2-3 sentences unless detailed analysis is requested.";
  
  let userPrompt = '';
  
  switch (action) {
    case 'habit_recommendation':
      userPrompt = `Based on this user's current habits (${userContext.habits.map(h => h.title).join(', ')}), suggest 3 new complementary habits they might want to build. Consider their digital usage patterns and current completion rates. Format as a JSON array of objects with 'title', 'description', 'category', and 'difficulty' (1-5) properties.`;
      break;
      
    case 'personalized_reminder':
      const habit = userContext.specificHabit;
      userPrompt = `Create a personalized, motivating reminder message for the habit "${habit?.title}". The current streak is ${currentStreak || 0} days, and it's ${timeOfDay || 'now'} for the user. Their completion rate is ${calculateCompletionRate(habit?.completions)}%. Make it encouraging ${currentStreak > 0 ? 'and mention maintaining their streak' : 'and help them get started'}. Format response as a simple string.`;
      break;
      
    case 'pattern_analysis':
      userPrompt = `Analyze this user's habit completion patterns and identify: 1) Their peak productivity times, 2) Common failure points in habit streaks, 3) Any correlations between different habits or digital usage. The current habit being analyzed is "${userContext.specificHabit?.title}". Format as a JSON object with keys 'peakTimes', 'failurePoints', 'correlations', and 'suggestions'.`;
      break;
      
    case 'notification_timing':
      userPrompt = `Based on this user's habit completion history and digital usage patterns, suggest the optimal times to send notifications for maximum engagement. Consider their typical active hours and when they've most successfully completed habits in the past. Format as a JSON array of time ranges in 24-hour format.`;
      break;
      
    default:
      userPrompt = `Provide general habit building advice based on the user's current habits and completion patterns. Be encouraging and specific.`;
  }
  
  return {
    system: systemPrompt,
    user: userPrompt,
    context: JSON.stringify(userContext)
  };
}

// Function to call the OpenAI API
async function callOpenAI(promptData: { system: string, user: string, context: string }) {
  try {
    if (!openAIApiKey) {
      console.error('OpenAI API key is not set');
      return { error: 'OpenAI API key is not configured', fallback: getFallbackResponse() };
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: promptData.system },
          { role: 'user', content: `Here is the relevant user context: ${promptData.context}\n\n${promptData.user}` }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return { error: error.message, fallback: getFallbackResponse() };
  }
}

// Calculate completion rate for a habit
function calculateCompletionRate(completions = []) {
  if (!completions.length) return 0;
  const completed = completions.filter(c => c.completed).length;
  return Math.round((completed / completions.length) * 100);
}

// Provide fallback responses when OpenAI is unavailable
function getFallbackResponse() {
  const fallbacks = [
    "Remember that consistency is key to building lasting habits. Try to complete this habit at the same time each day.",
    "Small steps lead to big changes. Focus on making this habit a regular part of your routine.",
    "You've been making good progress! Keep the momentum going with your habit today.",
    "Every time you complete this habit, you strengthen the neural pathways in your brain. Keep it up!",
    "Think about how you'll feel after completing this habit - focus on that satisfaction to help you get started."
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
