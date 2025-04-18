
import { supabase } from "@/integrations/supabase/client";

export interface DigitalUsageLog {
  site_url: string;
  site_category: 'productive' | 'neutral' | 'distracting';
  time_spent_seconds: number;
  user_id: string; // Changed from optional to required
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
