
import { supabase } from "@/integrations/supabase/client";
import { Habit, CompletionRecord } from "@/lib/habits";

// Type-safe mappings for interacting with Supabase
// These functions use the auto-generated types from supabase/types.ts

// Habits
export const fetchHabits = async (userId: string) => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
};

export const createHabit = async (habitData: {
  title: string;
  description?: string;
  category: string;
  frequency: string;
  time_of_day?: string;
  user_id: string;
  cue?: string;
  reward?: string;
  difficulty_level?: string;
  required_count?: number;
  requires_duration?: boolean;
  duration_minutes?: number;
}) => {
  const { data, error } = await supabase
    .from('habits')
    .insert(habitData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Habit Completions
export const recordHabitCompletion = async (completionData: {
  habit_id: string;
  user_id: string;
  completion_date: string;
  completion_count?: number;
  duration_minutes?: number;
  notes?: string;
  mood?: string;
  location?: string;
}) => {
  const { data, error } = await supabase
    .from('habit_completions')
    .insert(completionData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const fetchHabitCompletions = async (habitId: string, userId: string) => {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .order('completion_date', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Streaks
export const fetchStreakData = async (habitId: string, userId: string) => {
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Helper function to convert Supabase habit format to app format
export const mapSupabaseHabitToAppHabit = (supabaseHabit: any): Habit => {
  return {
    id: supabaseHabit.id,
    title: supabaseHabit.title,
    description: supabaseHabit.description || '',
    category: supabaseHabit.category,
    frequency: supabaseHabit.frequency,
    timeOfDay: supabaseHabit.time_of_day || 'anytime',
    createdAt: new Date(supabaseHabit.created_at),
    streak: 0, // This will be populated from streak data
    longestStreak: 0, // This will be populated from streak data
    completedToday: false, // This will need to be computed
    completionHistory: [] // This will be populated from completions data
  };
};

// Helper to convert completions to app format
export const mapSupabaseCompletionsToHistory = (completions: any[]): CompletionRecord[] => {
  return completions.map(completion => ({
    date: completion.completion_date,
    completed: true,
    notes: completion.notes
  }));
};
