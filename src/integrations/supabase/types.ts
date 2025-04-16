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
      accountability_checkins: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          partnership_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          partnership_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          partnership_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountability_checkins_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "accountability_partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      accountability_partnerships: {
        Row: {
          created_at: string | null
          id: string
          partner_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          partner_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          partner_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          activity_type: string
          content: string | null
          created_at: string | null
          habit_id: string | null
          id: string
          privacy_level: string
          user_id: string
        }
        Insert: {
          activity_type: string
          content?: string | null
          created_at?: string | null
          habit_id?: string | null
          id?: string
          privacy_level?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          content?: string | null
          created_at?: string | null
          habit_id?: string | null
          id?: string
          privacy_level?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_interactions: {
        Row: {
          activity_id: string
          comment_text: string | null
          created_at: string | null
          id: string
          interaction_type: string
          user_id: string
        }
        Insert: {
          activity_id: string
          comment_text?: string | null
          created_at?: string | null
          id?: string
          interaction_type: string
          user_id: string
        }
        Update: {
          activity_id?: string
          comment_text?: string | null
          created_at?: string | null
          id?: string
          interaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_interactions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_messages: {
        Row: {
          challenge_id: string
          created_at: string | null
          id: string
          message: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          id?: string
          message: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_messages_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          category: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          end_date: string
          id: string
          is_public: boolean | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          end_date: string
          id?: string
          is_public?: boolean | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          end_date?: string
          id?: string
          is_public?: boolean | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
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
      friend_requests: {
        Row: {
          created_at: string | null
          id: string
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          receiver_id: string
          sender_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string | null
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
      habit_templates: {
        Row: {
          category: string
          created_at: string | null
          creator_id: string
          description: string | null
          frequency: string
          id: string
          is_anonymous: boolean | null
          is_public: boolean | null
          time_of_day: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          frequency: string
          id?: string
          is_anonymous?: boolean | null
          is_public?: boolean | null
          time_of_day?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          frequency?: string
          id?: string
          is_anonymous?: boolean | null
          is_public?: boolean | null
          time_of_day?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
      privacy_settings: {
        Row: {
          allow_friend_requests: boolean | null
          created_at: string | null
          id: string
          searchable: boolean | null
          share_activity: boolean | null
          share_habits: boolean | null
          share_progress: boolean | null
          share_streaks: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allow_friend_requests?: boolean | null
          created_at?: string | null
          id?: string
          searchable?: boolean | null
          share_activity?: boolean | null
          share_habits?: boolean | null
          share_progress?: boolean | null
          share_streaks?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allow_friend_requests?: boolean | null
          created_at?: string | null
          id?: string
          searchable?: boolean | null
          share_activity?: boolean | null
          share_habits?: boolean | null
          share_progress?: boolean | null
          share_streaks?: boolean | null
          updated_at?: string | null
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
      template_ratings: {
        Row: {
          created_at: string | null
          id: string
          rating: number
          review: string | null
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating: number
          review?: string | null
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number
          review?: string | null
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_ratings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "habit_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_integrations: {
        Row: {
          access_token: string | null
          config: Json | null
          created_at: string | null
          id: string
          refresh_token: string | null
          service: string
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          refresh_token?: string | null
          service: string
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          refresh_token?: string | null
          service?: string
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: Json
          id: string
          is_active: boolean | null
          service: string
          signing_secret: string | null
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          events?: Json
          id?: string
          is_active?: boolean | null
          service: string
          signing_secret?: string | null
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          events?: Json
          id?: string
          is_active?: boolean | null
          service?: string
          signing_secret?: string | null
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      friends: {
        Row: {
          friend_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
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
