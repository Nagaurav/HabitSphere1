
import { supabase } from "@/integrations/supabase/client";

export type HabitAssistantAction = 
  | 'habit_recommendation' 
  | 'personalized_reminder' 
  | 'pattern_analysis' 
  | 'notification_timing';

export interface HabitAssistantRequest {
  action: HabitAssistantAction;
  userId: string;
  habitId?: string;
  currentStreak?: number;
  timeOfDay?: string;
  userData?: any;
}

export interface HabitRecommendation {
  title: string;
  description: string;
  category: string;
  difficulty: number;
}

export interface PatternAnalysis {
  peakTimes: string[];
  failurePoints: string[];
  correlations: string[];
  suggestions: string[];
}

/**
 * Calls the habit assistant edge function
 */
export const getHabitAssistant = async (params: HabitAssistantRequest) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // If user is logged in, use their ID, otherwise use a demo mode
    const userId = user?.id || 'demo-user';
    
    // Call the edge function
    const { data, error } = await supabase.functions.invoke('habit-assistant', {
      body: {
        ...params,
        userId: params.userId || userId,
        isDemoMode: !user
      }
    });
    
    if (error) throw error;
    
    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error calling habit assistant:', error);
    return {
      data: null,
      error: error.message
    };
  }
};

/**
 * Gets habit recommendations based on user's current habits
 */
export const getHabitRecommendations = async (userId?: string): Promise<HabitRecommendation[]> => {
  try {
    const { data, error } = await getHabitAssistant({
      action: 'habit_recommendation',
      userId: userId || ''
    });
    
    if (error) {
      console.error('AI service error:', error);
      // Return fallback recommendations if the AI service fails
      return getFallbackRecommendations();
    }
    
    // The AI returns a JSON string of recommendations
    if (data?.content) {
      try {
        // Parse the response content
        return JSON.parse(data.content);
      } catch (parseError) {
        console.error('Error parsing recommendations:', parseError);
        return getFallbackRecommendations();
      }
    }
    
    return getFallbackRecommendations();
  } catch (error) {
    console.error('Error getting habit recommendations:', error);
    return getFallbackRecommendations();
  }
};

/**
 * Gets a personalized reminder for a specific habit
 */
export const getPersonalizedReminder = async (habitId: string, currentStreak = 0, timeOfDay = 'now'): Promise<string> => {
  try {
    const { data, error } = await getHabitAssistant({
      action: 'personalized_reminder',
      userId: '',
      habitId,
      currentStreak,
      timeOfDay
    });
    
    if (error) throw new Error(error);
    
    // The AI returns a simple string message
    if (data?.content) {
      return data.content;
    }
    
    // Return fallback if available
    if (data?.fallback) {
      return data.fallback;
    }
    
    return "Don't forget to complete your habit!";
  } catch (error) {
    console.error('Error getting personalized reminder:', error);
    return "Don't forget to complete your habit!";
  }
};

/**
 * Gets pattern analysis for a user or specific habit
 */
export const getPatternAnalysis = async (habitId?: string): Promise<PatternAnalysis | null> => {
  try {
    const { data, error } = await getHabitAssistant({
      action: 'pattern_analysis',
      userId: '',
      habitId
    });
    
    if (error) throw new Error(error);
    
    // The AI returns a JSON string with analysis
    if (data?.content) {
      try {
        // Parse the response content
        return JSON.parse(data.content);
      } catch (parseError) {
        console.error('Error parsing pattern analysis:', parseError);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting pattern analysis:', error);
    return null;
  }
};

/**
 * Gets optimal notification timing suggestions
 */
export const getNotificationTiming = async (): Promise<string[]> => {
  try {
    const { data, error } = await getHabitAssistant({
      action: 'notification_timing',
      userId: ''
    });
    
    if (error) throw new Error(error);
    
    // The AI returns a JSON array of time ranges
    if (data?.content) {
      try {
        // Parse the response content
        return JSON.parse(data.content);
      } catch (parseError) {
        console.error('Error parsing notification timing:', parseError);
        return ['09:00', '12:00', '18:00']; // Default times
      }
    }
    
    return ['09:00', '12:00', '18:00']; // Default times
  } catch (error) {
    console.error('Error getting notification timing:', error);
    return ['09:00', '12:00', '18:00']; // Default times
  }
};

/**
 * Provides fallback recommendations when AI service is unavailable
 */
const getFallbackRecommendations = (): HabitRecommendation[] => {
  return [
    {
      title: "Drink water before meals",
      description: "Drinking a glass of water 30 minutes before each meal improves hydration and digestion",
      category: "health",
      difficulty: 1
    },
    {
      title: "5-minute meditation",
      description: "Take just 5 minutes each morning to sit quietly and focus on your breathing",
      category: "mindfulness",
      difficulty: 2
    },
    {
      title: "Daily gratitude journal",
      description: "Write down three things you're grateful for each evening before bed",
      category: "mindfulness",
      difficulty: 2
    },
    {
      title: "10,000 steps daily",
      description: "Aim to walk 10,000 steps throughout your day for improved health",
      category: "fitness",
      difficulty: 3
    }
  ];
};
