
import { supabase } from "@/integrations/supabase/client";

export interface DigitalUsageLog {
  site_url: string;
  site_category: 'productive' | 'neutral' | 'distracting';
  time_spent_seconds: number;
  user_id: string;
}

export const createDigitalUsageLog = async (logData: DigitalUsageLog) => {
  const { data, error } = await supabase
    .from('digital_usage_logs')
    .insert(logData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const fetchDigitalUsageLogs = async (filters?: {
  startDate?: string;
  endDate?: string;
  category?: 'productive' | 'neutral' | 'distracting';
  user_id: string;
}) => {
  let query = supabase.from('digital_usage_logs').select('*');
  
  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id);
  }
  
  if (filters?.startDate) {
    query = query.gte('logged_date', filters.startDate);
  }
  
  if (filters?.endDate) {
    query = query.lte('logged_date', filters.endDate);
  }
  
  if (filters?.category) {
    query = query.eq('site_category', filters.category);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const fetchTotalTimeByCategory = async (userId: string, dateRange?: { startDate: string, endDate: string }) => {
  const filters = {
    user_id: userId,
    ...(dateRange && { startDate: dateRange.startDate, endDate: dateRange.endDate })
  };

  const logs = await fetchDigitalUsageLogs(filters);
  
  // Aggregate time by category
  const timeByCategory = {
    productive: 0,
    neutral: 0,
    distracting: 0
  };
  
  logs.forEach(log => {
    if (log.site_category in timeByCategory) {
      timeByCategory[log.site_category as keyof typeof timeByCategory] += log.time_spent_seconds;
    }
  });
  
  return timeByCategory;
};

export const checkTimeLimits = async (siteUrl: string, userId: string) => {
  try {
    const response = await fetch('https://qmdqruppbuyutasssggx.supabase.co/functions/v1/check-time-limits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZHFydXBwYnV5dXRhc3NzZ2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mzg4ODAsImV4cCI6MjA2MDIxNDg4MH0.23m4emgF1TsS3WOl5HP7quhjGzDqtbd7S08K6o9dBAk'
      },
      body: JSON.stringify({
        site_url: siteUrl,
        user_id: userId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to check time limits');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking time limits:', error);
    return { limitExceeded: false, error: error.message };
  }
};
