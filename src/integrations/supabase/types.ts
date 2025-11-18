export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analysis_usage: {
        Row: {
          analysis_date: string
          created_at: string
          id: string
          reset_date: string
          subscription_plan_id: string
          user_id: string
          video_id: string
        }
        Insert: {
          analysis_date?: string
          created_at?: string
          id?: string
          reset_date: string
          subscription_plan_id: string
          user_id: string
          video_id: string
        }
        Update: {
          analysis_date?: string
          created_at?: string
          id?: string
          reset_date?: string
          subscription_plan_id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_usage_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "pricing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_usage_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_achievements: {
        Row: {
          achievement_type: string | null
          coach_profile_id: string
          created_at: string
          description: string | null
          id: string
          organization: string | null
          title: string
          year: number | null
        }
        Insert: {
          achievement_type?: string | null
          coach_profile_id: string
          created_at?: string
          description?: string | null
          id?: string
          organization?: string | null
          title: string
          year?: number | null
        }
        Update: {
          achievement_type?: string | null
          coach_profile_id?: string
          created_at?: string
          description?: string | null
          id?: string
          organization?: string | null
          title?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_coach_achievements_coach_profile"
            columns: ["coach_profile_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_education: {
        Row: {
          coach_profile_id: string
          created_at: string
          degree: string
          field_of_study: string | null
          id: string
          institution: string
          year_completed: number | null
        }
        Insert: {
          coach_profile_id: string
          created_at?: string
          degree: string
          field_of_study?: string | null
          id?: string
          institution: string
          year_completed?: number | null
        }
        Update: {
          coach_profile_id?: string
          created_at?: string
          degree?: string
          field_of_study?: string | null
          id?: string
          institution?: string
          year_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_coach_education_coach_profile"
            columns: ["coach_profile_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_profiles: {
        Row: {
          availability_schedule: Json | null
          certifications: string[] | null
          coaching_philosophy: string | null
          created_at: string
          currency: string | null
          id: string
          languages: string[] | null
          rate_per_hour: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
          years_coaching: number | null
        }
        Insert: {
          availability_schedule?: Json | null
          certifications?: string[] | null
          coaching_philosophy?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          languages?: string[] | null
          rate_per_hour?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          years_coaching?: number | null
        }
        Update: {
          availability_schedule?: Json | null
          certifications?: string[] | null
          coaching_philosophy?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          languages?: string[] | null
          rate_per_hour?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          years_coaching?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_coach_profiles_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      coach_specialties: {
        Row: {
          coach_profile_id: string
          created_at: string
          id: string
          proficiency: Database["public"]["Enums"]["coach_proficiency"]
          specialty_type_id: string
          years_experience: number | null
        }
        Insert: {
          coach_profile_id: string
          created_at?: string
          id?: string
          proficiency?: Database["public"]["Enums"]["coach_proficiency"]
          specialty_type_id: string
          years_experience?: number | null
        }
        Update: {
          coach_profile_id?: string
          created_at?: string
          id?: string
          proficiency?: Database["public"]["Enums"]["coach_proficiency"]
          specialty_type_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_coach_specialties_coach_profile"
            columns: ["coach_profile_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_coach_specialties_specialty_type"
            columns: ["specialty_type_id"]
            isOneToOne: false
            referencedRelation: "specialty_types"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_statistics: {
        Row: {
          average_rating: number | null
          coach_profile_id: string
          id: string
          response_time_hours: number | null
          success_rate: number | null
          total_reviews: number | null
          total_sessions: number | null
          total_students: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          coach_profile_id: string
          id?: string
          response_time_hours?: number | null
          success_rate?: number | null
          total_reviews?: number | null
          total_sessions?: number | null
          total_students?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          coach_profile_id?: string
          id?: string
          response_time_hours?: number | null
          success_rate?: number | null
          total_reviews?: number | null
          total_sessions?: number | null
          total_students?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_coach_statistics_coach_profile"
            columns: ["coach_profile_id"]
            isOneToOne: true
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_areas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string
          id: string
          losses: number
          month: string
          rating: number
          updated_at: string
          user_id: string
          wins: number
        }
        Insert: {
          created_at?: string
          id?: string
          losses?: number
          month: string
          rating?: number
          updated_at?: string
          user_id: string
          wins?: number
        }
        Update: {
          created_at?: string
          id?: string
          losses?: number
          month?: string
          rating?: number
          updated_at?: string
          user_id?: string
          wins?: number
        }
        Relationships: []
      }
      pricing: {
        Row: {
          analysis_limit: number | null
          button_text: string
          button_variant: string
          created_at: string
          description: string
          display_order: number
          features: string[]
          id: string
          monthly_price: number
          name: string
          recommended: boolean
          updated_at: string
          yearly_price: number
        }
        Insert: {
          analysis_limit?: number | null
          button_text?: string
          button_variant?: string
          created_at?: string
          description: string
          display_order?: number
          features?: string[]
          id?: string
          monthly_price?: number
          name: string
          recommended?: boolean
          updated_at?: string
          yearly_price?: number
        }
        Update: {
          analysis_limit?: number | null
          button_text?: string
          button_variant?: string
          created_at?: string
          description?: string
          display_order?: number
          features?: string[]
          id?: string
          monthly_price?: number
          name?: string
          recommended?: boolean
          updated_at?: string
          yearly_price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          location: string | null
          member_since: string | null
          phone: string | null
          playing_experience: string | null
          preferred_play_style: string | null
          profile_image: string | null
          sport_id: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          location?: string | null
          member_since?: string | null
          phone?: string | null
          playing_experience?: string | null
          preferred_play_style?: string | null
          profile_image?: string | null
          sport_id?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          location?: string | null
          member_since?: string | null
          phone?: string | null
          playing_experience?: string | null
          preferred_play_style?: string | null
          profile_image?: string | null
          sport_id?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      specialty_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      sports: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users_subscription: {
        Row: {
          auto_renew: boolean
          created_at: string
          currency: string
          end_date: string | null
          id: string
          price_paid: number
          pricing_plan_id: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          price_paid?: number
          pricing_plan_id: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          price_paid?: number
          pricing_plan_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_subscription_pricing_plan_id_fkey"
            columns: ["pricing_plan_id"]
            isOneToOne: false
            referencedRelation: "pricing"
            referencedColumns: ["id"]
          },
        ]
      }
      video_coaches: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          status: string
          video_id: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          status?: string
          video_id: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          status?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_video_coaches_coach_id"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_video_coaches_video_id"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_feedback: {
        Row: {
          coach_id: string
          created_at: string
          feedback_text: string
          id: string
          player_id: string
          rating: number | null
          updated_at: string
          video_id: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          feedback_text: string
          id?: string
          player_id: string
          rating?: number | null
          updated_at?: string
          video_id: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          feedback_text?: string
          id?: string
          player_id?: string
          rating?: number | null
          updated_at?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_feedback_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          analyzed: boolean | null
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          focus_area: string | null
          id: string
          title: string | null
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          analyzed?: boolean | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          focus_area?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          analyzed?: boolean | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          focus_area?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_analysis: {
        Args: { user_id_param: string }
        Returns: {
          can_create: boolean
          analyses_used: number
          analyses_limit: number
          next_reset_date: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_coach_assigned_to_video: {
        Args: { _video_id: string; _coach_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "coach" | "player"
      coach_proficiency: "beginner" | "intermediate" | "advanced" | "expert"
      subscription_status: "active" | "cancelled" | "expired" | "pending"
      subscription_type: "monthly" | "yearly" | "free"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "coach", "player"],
      coach_proficiency: ["beginner", "intermediate", "advanced", "expert"],
      subscription_status: ["active", "cancelled", "expired", "pending"],
      subscription_type: ["monthly", "yearly", "free"],
    },
  },
} as const
