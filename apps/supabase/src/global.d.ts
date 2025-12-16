import type { Database as DB } from "@/lib/supabase/database.types";
import type { User } from "@supabase/supabase-js";

declare global {
  type Database = DB;
  type Feed = DB["public"]["Tables"]["feeds"]["Row"];
  type FeedImage = DB["public"]["Tables"]["feed_images"]["Row"];
  type FeedReaction = DB["public"]["Tables"]["feed_engagement"]["Row"];
  type Comment = DB["public"]["Tables"]["comments"]["Row"];
  type CommentReaction = DB["public"]["Tables"]["comment_engagement"]["Row"];
  type UserFollows = DB["public"]["Tables"]["user_follows"]["Row"];
  type Profile = DB["public"]["Tables"]["profiles"]["Row"];
  type Notifications = DB["public"]["Tables"]["notifications"]["Row"];
  type Feed_Collections = DB["public"]["Tables"]["feed_collections"]["Row"];
  type User= User;
  type Feed_Detail =
    | (Feed & {
        feed_images?: FeedImage[];
        user_id?: Profile;
      })
    | null;
  type Notifications_Detail =
    | (Notifications & {
        user_id?: Profile;
        feed_id?: Feed;
        comment_id?: Feed;
      })
    | null;
  type Feed_Collections_Detail =
    | (Feed_Collections & {
        feed_id?: Feed_Detail;
      })
    | null;
  type FeedReaction_Detail =
    | (FeedReaction & {
        user_id?: Profile;
        feed_id?: Feed;
      })
    | null;
  type Feed_Detail_Comment =
    | (Comment & {
        user_id?: Profile;
        feed_id?: Feed;
      })
    | null;

  type Comment_Detail = Feed & {
    countComment?: number;
    totalReactions?: number;
  } | null;

  type UserFeatured =  Profile & {
    feeds?: Feed_Detail[];
    countFollowing? : number;  
    user_follower? : UserFollows;
  }
  type Comment_Detail_Full = Feed & {
    user_id?: Profile;
    parent_id?: Comment_Detail;
    replies?: Comment_Detail[] & {
      totalReactions?: number;
      countComment? : number;
    } | null;
    reactions?: CommentReaction;
    totalReactions?: number;
    countComment? : number;
  } | null;
  type Session =
    | {
        user: User;
      }
    | {
        user: null;
      };
}
