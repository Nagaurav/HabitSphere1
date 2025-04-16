export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      digital_usage_logs: {
        Row: {
          created_at: string
          id: string
          logged_date: string
          site_category: string
          site_url: string
          time_spent_seconds: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          logged_date?: string
          site_category: string
          site_url: string
          time_spent_seconds: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          logged_date?: string
          site_category?: string
          site_url?: string
          time_spent_seconds?: number
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          completed_at: string
          completion_count: number | null
          completion_date: string
          duration_minutes: number | null
          habit_id: string
          id: string
          location: string | null
          mood: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          completion_count?: number | null
          completion_date: string
          duration_minutes?: number | null
          habit_id: string
          id?: string
          location?: string | null
          mood?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          completion_count?: number | null
          completion_date?: string
          duration_minutes?: number | null
          habit_id?: string
          id?: string
          location?: string | null
          mood?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          archived: boolean | null
          category: string
          created_at: string
          cue: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          frequency: string
          id: string
          required_count: number | null
          requires_duration: boolean | null
          reward: string | null
          time_of_day: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          category: string
          created_at?: string
          cue?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          frequency: string
          id?: string
          required_count?: number | null
          requires_duration?: boolean | null
          reward?: string | null
          time_of_day?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean | null
          category?: string
          created_at?: string
          cue?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          frequency?: string
          id?: string
          required_count?: number | null
          requires_duration?: boolean | null
          reward?: string | null
          time_of_day?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_blocking_rules: {
        Row: {
          block_end_time: string | null
          block_start_time: string | null
          created_at: string
          id: string
          is_blocked: boolean
          site_category: string
          site_url: string
          updated_at: string
          user_id: string
        }
        Insert: {
          block_end_time?: string | null
          block_start_time?: string | null
          created_at?: string
          id?: string
          is_blocked?: boolean
          site_category: string
          site_url: string
          updated_at?: string
          user_id: string
        }
        Update: {
          block_end_time?: string | null
          block_start_time?: string | null
          created_at?: string
          id?: string
          is_blocked?: boolean
          site_category?: string
          site_url?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          current_streak: number | null
          habit_id: string
          id: string
          last_completed_date: string | null
          longest_streak: number | null
          recovery_credits: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number | null
          habit_id: string
          id?: string
          last_completed_date?: string | null
          longest_streak?: number | null
          recovery_credits?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number | null
          habit_id?: string
          id?: string
          last_completed_date?: string | null
          longest_streak?: number | null
          recovery_credits?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
