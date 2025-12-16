export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          access_token: string | null;
          expires_at: number | null;
          id: string;
          id_token: string | null;
          oauth_token: string | null;
          oauth_token_secret: string | null;
          provider: string;
          providerAccountId: string;
          refresh_token: string | null;
          scope: string | null;
          session_state: string | null;
          token_type: string | null;
          type: string;
          userId: string | null;
        };
        Insert: {
          access_token?: string | null;
          expires_at?: number | null;
          id?: string;
          id_token?: string | null;
          oauth_token?: string | null;
          oauth_token_secret?: string | null;
          provider: string;
          providerAccountId: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type: string;
          userId?: string | null;
        };
        Update: {
          access_token?: string | null;
          expires_at?: number | null;
          id?: string;
          id_token?: string | null;
          oauth_token?: string | null;
          oauth_token_secret?: string | null;
          provider?: string;
          providerAccountId?: string;
          refresh_token?: string | null;
          scope?: string | null;
          session_state?: string | null;
          token_type?: string | null;
          type?: string;
          userId?: string | null;
        };
        Relationships: [];
      };
      comment_engagement: {
        Row: {
          comment_id: string;
          created_at: string;
          id: string;
          state: Database["public"]["Enums"]["state"] | null;
          user_id: string;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          id?: string;
          state?: Database["public"]["Enums"]["state"] | null;
          user_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          id?: string;
          state?: Database["public"]["Enums"]["state"] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          content: string;
          created_at: string;
          feed_id: string;
          id: string;
          parent_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          feed_id: string;
          id?: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          feed_id?: string;
          id?: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
        ];
      };
      feed_collections: {
        Row: {
          created_at: string;
          feed_id: string | null;
          id: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          feed_id?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          feed_id?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      feed_engagement: {
        Row: {
          created_at: string;
          feed_id: string;
          id: string;
          state: Database["public"]["Enums"]["state"];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          feed_id: string;
          id?: string;
          state: Database["public"]["Enums"]["state"];
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          feed_id?: string;
          id?: string;
          state?: Database["public"]["Enums"]["state"];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feed_engagement_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feed_engagement_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      feed_images: {
        Row: {
          created_at: string;
          feed_id: string;
          id: string;
          image: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          feed_id: string;
          id?: string;
          image: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          feed_id?: string;
          id?: string;
          image?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feed_images_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
        ];
      };
      feed_medias: {
        Row: {
          created_at: string;
          domain: string | null;
          feed_id: string | null;
          id: string;
          title: string | null;
          updated_at: string | null;
          video: string | null;
        };
        Insert: {
          created_at?: string;
          domain?: string | null;
          feed_id?: string | null;
          id?: string;
          title?: string | null;
          updated_at?: string | null;
          video?: string | null;
        };
        Update: {
          created_at?: string;
          domain?: string | null;
          feed_id?: string | null;
          id?: string;
          title?: string | null;
          updated_at?: string | null;
          video?: string | null;
        };
        Relationships: [];
      };
      feeds: {
        Row: {
          content: string | null;
          created_at: string;
          id: string;
          parent_id: string | null;
          privacy: Database["public"]["Enums"]["feed_privacy"];
          status: Database["public"]["Enums"]["feed_status"];
          type: Database["public"]["Enums"]["type"];
          updated_at: string;
          user_id: string;
          user_id_public: string | null;
          pin: boolean;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          privacy?: Database["public"]["Enums"]["feed_privacy"];
          status?: Database["public"]["Enums"]["feed_status"];
          type?: Database["public"]["Enums"]["type"];
          updated_at?: string;
          user_id: string | null;
          user_id_public?: string | null;
          pin: boolean;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          privacy?: Database["public"]["Enums"]["feed_privacy"];
          status?: Database["public"]["Enums"]["feed_status"];
          type?: Database["public"]["Enums"]["type"];
          updated_at?: string;
          user_id?: string;
          user_id_public?: string | null;
          pin: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "feeds_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feeds_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          comment_id: string | null;
          created_at: string;
          feed_id: string | null;
          following_id: string | null;
          id: string;
          state: Database["public"]["Enums"]["state"] | null;
          status: boolean;
          type: string;
          updated_at: string | null;
          user_id: string | null;
          user_noti_id: string | null;
          read: boolean;
        };
        Insert: {
          comment_id?: string | null;
          created_at?: string;
          feed_id?: string | null;
          following_id?: string | null;
          id?: string;
          state?: Database["public"]["Enums"]["state"] | null;
          status?: boolean;
          type: string;
          updated_at?: string | null;
          user_id?: string | null;
          user_noti_id?: string | null;
          read: boolean;
        };
        Update: {
          comment_id?: string | null;
          created_at?: string;
          feed_id?: string | null;
          following_id?: string | null;
          id?: string;
          state?: Database["public"]["Enums"]["state"] | null;
          status?: boolean;
          type?: string;
          updated_at?: string | null;
          user_id?: string | null;
          user_noti_id?: string | null;
          read: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_following_id_fkey";
            columns: ["following_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          birthday: string | null;
          description: string | null;
          display_name: string | null;
          full_name: string | null;
          gender: string;
          id: string;
          privacy: Database["public"]["Enums"]["user_privacy"] | null;
          trial_end: string | null;
          types: string | null;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          birthday?: string | null;
          description?: string | null;
          display_name?: string | null;
          full_name?: string | null;
          gender?: string;
          id: string;
          privacy?: Database["public"]["Enums"]["user_privacy"] | null;
          trial_end?: string | null;
          types?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          birthday?: string | null;
          description?: string | null;
          display_name?: string | null;
          full_name?: string | null;
          gender?: string;
          id?: string;
          privacy?: Database["public"]["Enums"]["user_privacy"] | null;
          trial_end?: string | null;
          types?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      sessions: {
        Row: {
          expires: string;
          id: string;
          sessionToken: string;
          userId: string | null;
        };
        Insert: {
          expires: string;
          id?: string;
          sessionToken: string;
          userId?: string | null;
        };
        Update: {
          expires?: string;
          id?: string;
          sessionToken?: string;
          userId?: string | null;
        };
        Relationships: [];
      };
      todos: {
        Row: {
          id: string;
          title: string;
        };
        Insert: {
          id?: string;
          title: string;
        };
        Update: {
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      user_follows: {
        Row: {
          created_at: string;
          following_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          following_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          following_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_follows_following_id_fkey";
            columns: ["following_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_follows_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      verification_tokens: {
        Row: {
          expires: string;
          identifier: string | null;
          token: string;
        };
        Insert: {
          expires: string;
          identifier?: string | null;
          token: string;
        };
        Update: {
          expires?: string;
          identifier?: string | null;
          token?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_full_name_view: {
        Args: {
          view_name: string;
          pattern: string;
        };
        Returns: undefined;
      };
      find_profiles_and_feeds: {
        args: {
          search_term: string;
        };
      };
      search_default: {
        args: {
          user_id_in: string;
        };
      };
      nanoid: {
        Args: {
          size?: number;
          alphabet?: string;
        };
        Returns: string;
      };
      select_from_view: {
        Args: {
          view_name: string;
        };
        Returns: Record<string, unknown>[];
      };
      uid: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      unaccent: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      unaccent_init: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      verify_user_password:{
        args: {
          password: string,
          user_id: string
        }
        Returns: boolean;
      }
      count_descendant_feeds:{
        args: {
          feed_id: string
        }
        Returns: number;
      }
      update_notifications_status:{
        args: {
          user_id: string,
        }
        Returns: boolean
      }
    };
    Enums: {
      feed_privacy: FeedPrivacy;
      feed_status: FeedStatus;
      state: ReactionState;
      user_privacy: UserPrivacy;
      type: FeedType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

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

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
  ? R
  : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I;
  }
  ? I
  : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U;
  }
  ? U
  : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
