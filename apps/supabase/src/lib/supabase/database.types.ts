export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      comment_engagement: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          state: Database["public"]["Enums"]["state"] | null
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          state?: Database["public"]["Enums"]["state"] | null
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          state?: Database["public"]["Enums"]["state"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_engagement_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          feed_id: string
          id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          feed_id: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          feed_id?: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_collections: {
        Row: {
          created_at: string
          feed_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feed_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feed_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_collections_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_engagement: {
        Row: {
          created_at: string
          feed_id: string
          id: string
          state: Database["public"]["Enums"]["state"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feed_id: string
          id?: string
          state?: Database["public"]["Enums"]["state"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          feed_id?: string
          id?: string
          state?: Database["public"]["Enums"]["state"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_engagement_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_engagement_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_images: {
        Row: {
          created_at: string
          feed_id: string
          id: string
          image: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feed_id: string
          id?: string
          image: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feed_id?: string
          id?: string
          image?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_images_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_medias: {
        Row: {
          created_at: string
          domain: string | null
          feed_id: string | null
          id: string
          title: string | null
          updated_at: string | null
          video: string | null
        }
        Insert: {
          created_at?: string
          domain?: string | null
          feed_id?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          video?: string | null
        }
        Update: {
          created_at?: string
          domain?: string | null
          feed_id?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          video?: string | null
        }
        Relationships: []
      }
      feeds: {
        Row: {
          content: string | null
          created_at: string
          id: string
          parent_id: string | null
          pin: boolean | null
          privacy: Database["public"]["Enums"]["feed_privacy"]
          status: Database["public"]["Enums"]["feed_status"]
          type: Database["public"]["Enums"]["type"]
          updated_at: string
          user_id: string
          user_id_public: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          pin?: boolean | null
          privacy?: Database["public"]["Enums"]["feed_privacy"]
          status?: Database["public"]["Enums"]["feed_status"]
          type?: Database["public"]["Enums"]["type"]
          updated_at?: string
          user_id: string
          user_id_public?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          pin?: boolean | null
          privacy?: Database["public"]["Enums"]["feed_privacy"]
          status?: Database["public"]["Enums"]["feed_status"]
          type?: Database["public"]["Enums"]["type"]
          updated_at?: string
          user_id?: string
          user_id_public?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feeds_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeds_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          comment_id: string | null
          created_at: string
          feed_id: string | null
          following_id: string | null
          id: string
          read: boolean | null
          state: Database["public"]["Enums"]["state"] | null
          status: boolean
          type: string
          updated_at: string | null
          user_id: string | null
          user_noti_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          feed_id?: string | null
          following_id?: string | null
          id?: string
          read?: boolean | null
          state?: Database["public"]["Enums"]["state"] | null
          status?: boolean
          type: string
          updated_at?: string | null
          user_id?: string | null
          user_noti_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          feed_id?: string | null
          following_id?: string | null
          id?: string
          read?: boolean | null
          state?: Database["public"]["Enums"]["state"] | null
          status?: boolean
          type?: string
          updated_at?: string | null
          user_id?: string | null
          user_noti_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birthday: string | null
          description: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          gender: string
          id: string
          phonenumber: string | null
          privacy: Database["public"]["Enums"]["user_privacy"] | null
          trial_end: string | null
          types: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          birthday?: string | null
          description?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string
          id: string
          phonenumber?: string | null
          privacy?: Database["public"]["Enums"]["user_privacy"] | null
          trial_end?: string | null
          types?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          birthday?: string | null
          description?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string
          id?: string
          phonenumber?: string | null
          privacy?: Database["public"]["Enums"]["user_privacy"] | null
          trial_end?: string | null
          types?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      report: {
        Row: {
          content: string | null
          created_at: string
          id: number
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          following_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          following_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          following_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_descendant_feeds: { Args: { feed_id: string }; Returns: number }
      find_profiles_and_feeds: {
        Args: { search_term: string }
        Returns: {
          avatar_url: string | null
          birthday: string | null
          description: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          gender: string
          id: string
          phonenumber: string | null
          privacy: Database["public"]["Enums"]["user_privacy"] | null
          trial_end: string | null
          types: string | null
          updated_at: string | null
          website: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_users_with_most_posts: {
        Args: { limitdata: number }
        Returns: {
          avatar_url: string | null
          birthday: string | null
          description: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          gender: string
          id: string
          phonenumber: string | null
          privacy: Database["public"]["Enums"]["user_privacy"] | null
          trial_end: string | null
          types: string | null
          updated_at: string | null
          website: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      search_default: {
        Args: { user_id_in: string }
        Returns: {
          avatar_url: string | null
          birthday: string | null
          description: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          gender: string
          id: string
          phonenumber: string | null
          privacy: Database["public"]["Enums"]["user_privacy"] | null
          trial_end: string | null
          types: string | null
          updated_at: string | null
          website: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      verify_user_password: {
        Args: { password: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      feed_privacy: "public" | "follow" | "private"
      feed_status: "active" | "hide" | "deleted" | "reported"
      state: "like" | "dislike" | "neutral"
      type: "feed" | "comment"
      user_privacy: "owner" | "guest"
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
      feed_privacy: ["public", "follow", "private"],
      feed_status: ["active", "hide", "deleted", "reported"],
      state: ["like", "dislike", "neutral"],
      type: ["feed", "comment"],
      user_privacy: ["owner", "guest"],
    },
  },
} as const

// --- Hand-written app enums (kept across type regeneration) ---
// Note: ReactionState includes UI-only states beyond the DB enum `state`.

export enum FeedPrivacy {
  PUBLIC = "public",
  FOLLOW = "follow",
  PRIVATE = "private",
}

export enum ReactionState {
  LIKE = "like",
  NEUTRAL = "neutral",
  DISLIKE = "dislike",
  INITIAL = "initial",
  HOVER = "hover",
  ACTIVE = "active",
  DISABLE = "disable",
}

export enum UserPrivacy {
  OWNER = "owner",
  GUEST = "guest",
}

export enum FeedStatus {
  ACTIVE = "active",
  HIDE = "hide",
  DELETED = "deleted",
  REPORTED = "reported",
}

export enum FeedType {
  FEED = "feed",
  COMMENT = "comment",
}
