
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE SCHEMA IF NOT EXISTS "next_auth";

ALTER SCHEMA "next_auth" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pgroonga" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgaudit" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."feed_privacy" AS ENUM (
    'public',
    'follow',
    'private'
);

ALTER TYPE "public"."feed_privacy" OWNER TO "postgres";

CREATE TYPE "public"."feed_status" AS ENUM (
    'active',
    'hide',
    'deleted',
    'reported'
);

ALTER TYPE "public"."feed_status" OWNER TO "postgres";

CREATE TYPE "public"."profile_with_feed_count" AS (
	"id" integer,
	"display_name" "text",
	"feed_count" bigint
);

ALTER TYPE "public"."profile_with_feed_count" OWNER TO "postgres";

CREATE TYPE "public"."state" AS ENUM (
    'like',
    'dislike',
    'neutral'
);

ALTER TYPE "public"."state" OWNER TO "postgres";

CREATE TYPE "public"."type" AS ENUM (
    'feed',
    'comment'
);

ALTER TYPE "public"."type" OWNER TO "postgres";

CREATE TYPE "public"."user_privacy" AS ENUM (
    'owner',
    'guest'
);

ALTER TYPE "public"."user_privacy" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "next_auth"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
 insert into next_auth.users (id)
  values (new.id);
  return new;
end;$$;

ALTER FUNCTION "next_auth"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "next_auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

ALTER FUNCTION "next_auth"."uid"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."count_descendant_feeds"("feed_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    descendant_count INTEGER;
BEGIN
    WITH RECURSIVE feed_hierarchy AS (
        -- Anchor member: select the parent feed
        SELECT 
            id, 
            parent_id
        FROM 
            public.feeds
        WHERE 
            id = feed_id

        UNION ALL

        -- Recursive member: select children of the previous result set
        SELECT 
            f.id, 
            f.parent_id
        FROM 
            public.feeds f
        INNER JOIN 
            feed_hierarchy fh ON fh.id = f.parent_id
    )
    -- Select count of all feeds in the hierarchy excluding the parent feed
    SELECT COUNT(*)
    INTO descendant_count
    FROM feed_hierarchy
    WHERE id != feed_id;

    RETURN descendant_count;
END;
$$;

ALTER FUNCTION "public"."count_descendant_feeds"("feed_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_nanoid"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  declare
    new_id text;
BEGIN
    -- Generate new_id here, for example:
    -- new_id := gen_random_uuid(); -- This requires the pgcrypto extension
    -- new_id := nanoid(12);
    new_id = '43534534';
    INSERT INTO public.users (id)
    VALUES (
        new.id
    );
    RETURN new;
end;
$$;

ALTER FUNCTION "public"."create_nanoid"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "display_name" "text",
    "full_name" "text",
    "avatar_url" "text",
    "website" "text",
    "description" "text",
    "gender" "text" DEFAULT 'male'::"text" NOT NULL,
    "types" "text",
    "privacy" "public"."user_privacy",
    "birthday" "date",
    "trial_end" timestamp with time zone,
    "email" "text",
    "phoneNumber" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("display_name") >= 3))
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."find_profiles_and_feeds"("search_term" "text") RETURNS SETOF "public"."profiles"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    most_followed_ids uuid[];
BEGIN
    SELECT ARRAY(
        SELECT following_id
        FROM (
            SELECT following_id, COUNT(*) as follow_count
            FROM public.user_follows
            GROUP BY following_id
            ORDER BY COUNT(*) DESC
        ) uf
        ) INTO most_followed_ids;

    RETURN QUERY
        SELECT *
        FROM public.profiles
        WHERE id = ANY(array(SELECT unnest(most_followed_ids)))
        AND display_name &@~ search_term 
        ORDER BY array_position(most_followed_ids, id);
END;$$;

ALTER FUNCTION "public"."find_profiles_and_feeds"("search_term" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_feed_count"() RETURNS TABLE("id" "uuid", "feed_count" bigint)
    LANGUAGE "plpgsql"
    AS $$ begin select id, count(*) as feed_count from feeds group by id order by feed_count desc; end; $$;

ALTER FUNCTION "public"."get_feed_count"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_users_with_most_posts"("limitdata" bigint) RETURNS SETOF "public"."profiles"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    _profile profiles%ROWTYPE;
BEGIN
    FOR _profile IN
        SELECT profiles.*,  count(feeds.id) AS feed_count
        FROM feeds
        JOIN profiles ON feeds.user_id = profiles.id
        GROUP BY profiles.id  
        ORDER BY feed_count DESC        
        LIMIT  limitData
    LOOP
        RETURN NEXT _profile;
    END LOOP;
    RETURN;
END;
$$;

ALTER FUNCTION "public"."get_users_with_most_posts"("limitdata" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    IF new.raw_app_meta_data->>'provider' = 'google' THEN
        INSERT INTO public.profiles (id, display_name, avatar_url, full_name,email)
        VALUES (
            new.id,
            new.raw_user_meta_data->>'full_name', 
            new.raw_user_meta_data->>'avatar_url',
            new.raw_user_meta_data->>'full_name',
            new.email
        );

    ELSIF new.raw_app_meta_data->>'provider' = 'facebook' THEN
        INSERT INTO public.profiles (id, display_name, avatar_url, full_name, email)
        VALUES (
            new.id,
            new.raw_user_meta_data->>'full_name', 
            new.raw_user_meta_data->>'avatar_url',
            new.raw_user_meta_data->>'full_name',
            new.email
        );
        
    ELSE 
        INSERT INTO public.profiles (id, display_name)
        VALUES (
            new.id,
            new.email
        );
    END IF;
    RETURN new;  
END;$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_notifications"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
    owner_id UUID;
    comment_exist UUID;
    follower RECORD;
BEGIN
    IF TG_TABLE_NAME = 'feeds' THEN
        -- Check if the new feed is a comment
        IF NEW.type = 'comment' THEN
            -- Fetch the user_id of the parent feed to notify the owner
            SELECT user_id INTO owner_id
            FROM feeds
            WHERE id = NEW.parent_id;
            
            -- Insert notification for a new comment
            INSERT INTO public.notifications (type, user_id, feed_id, comment_id, user_noti_id)
            VALUES ('comments', NEW.user_id, NEW.parent_id, NEW.id, owner_id);
             ELSIF NEW.type = 'feed' THEN
            -- Check table user_follows where following_id = feed.user_id
            FOR follower IN
                SELECT user_id FROM user_follows WHERE following_id = NEW.user_id
            LOOP
                -- Insert notification per record
                INSERT INTO public.notifications (type, user_id, feed_id, user_noti_id)
                VALUES ('feed', New.user_id, NEW.id, follower.user_id);
            END LOOP;
        END IF;
    ELSIF TG_TABLE_NAME = 'feed_engagement' THEN
            -- Check if the feed is an engagement on another feed (e.g., a like or share)
            SELECT parent_id, user_id INTO comment_exist, owner_id
            FROM feeds
            WHERE id = NEW.feed_id;
            
            IF comment_exist IS NOT NULL THEN
                -- It's a comment engagement
                INSERT INTO public.notifications (type, user_id, feed_id, user_noti_id, state)
                VALUES ('comment_engagement', NEW.user_id, NEW.feed_id, owner_id, NEW.state);
            ELSE
                -- It's a feed engagement
                INSERT INTO public.notifications (type, user_id, feed_id, user_noti_id, state)
                VALUES ('feed_engagement', NEW.user_id, NEW.feed_id, owner_id, NEW.state);
            END IF;
    ELSIF TG_TABLE_NAME = 'user_follows' THEN
        -- Insert notification for a new follower
        INSERT INTO public.notifications (type, user_id, following_id, user_noti_id)
        VALUES ('user_follows', NEW.user_id, NEW.following_id, NEW.following_id);
        
    END IF;
    RETURN NEW;
END;$$;

ALTER FUNCTION "public"."handle_notifications"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."nanoid"("size" integer DEFAULT 21, "alphabet" "text" DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'::"text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    idBuilder text := '';
    i int := 0;
    bytes bytea;
    alphabetIndex int;
    mask int;
    step int;
BEGIN
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    while true
        loop
            bytes := gen_random_bytes(size);
            while i < size
                loop
                    alphabetIndex := (get_byte(bytes, i) & mask) + 1;
                    if alphabetIndex <= length(alphabet) then
                        idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
                        if length(idBuilder) = size then
                            return idBuilder;
                        end if;
                    end if;
                    i = i + 1;
                end loop;

            i := 0;
        end loop;
END
$$;

ALTER FUNCTION "public"."nanoid"("size" integer, "alphabet" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."search_default"("user_id_in" "uuid") RETURNS SETOF "public"."profiles"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    most_followed_ids uuid[];
BEGIN
    IF user_id_in IS NOT NULL THEN
        SELECT ARRAY(
            SELECT following_id
            FROM (
                SELECT following_id, COUNT(*) as follow_count
                FROM public.user_follows
                WHERE following_id <> user_id_in
                GROUP BY following_id
                ORDER BY COUNT(*) DESC
                LIMIT 10
            ) uf
        ) INTO most_followed_ids;
    ELSE
        SELECT ARRAY(
            SELECT following_id
            FROM (
                SELECT following_id, COUNT(*) as follow_count
                FROM public.user_follows
                GROUP BY following_id
                ORDER BY COUNT(*) DESC
                LIMIT 10
            ) uf
        ) INTO most_followed_ids;
    END IF;
    
    RETURN QUERY
    SELECT *
    FROM public.profiles
    WHERE id = ANY(array(SELECT unnest(most_followed_ids)))
    ORDER BY array_position(most_followed_ids, id);
END;$$;

ALTER FUNCTION "public"."search_default"("user_id_in" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

ALTER FUNCTION "public"."uid"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_notifications_status"("user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$DECLARE
  has_false_status boolean := false;  -- Start with the assumption that no changes were needed
BEGIN
  -- Check if any notifications for the user have status = false
  SELECT EXISTS (
    SELECT 1 FROM public.notifications 
    WHERE status = false AND user_noti_id = update_notifications_status.user_id
  ) INTO has_false_status;

  -- Update all notifications for the user to status = true if at least one was false
  IF has_false_status THEN
    UPDATE public.notifications SET status = true WHERE user_noti_id = update_notifications_status.user_id;
  END IF;

  RETURN has_false_status; -- Indicate if any changes were made
END;$$;

ALTER FUNCTION "public"."update_notifications_status"("user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."verify_user_password"("password" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = auth.uid() AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$$;

ALTER FUNCTION "public"."verify_user_password"("password" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."verify_user_password"("password" "text", "user_id" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = user_id AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$$;

ALTER FUNCTION "public"."verify_user_password"("password" "text", "user_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."verify_user_password"("password" "text", "user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = user_id AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$$;

ALTER FUNCTION "public"."verify_user_password"("password" "text", "user_id" "uuid") OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "providerAccountId" "text" NOT NULL,
    "refresh_token" "text",
    "access_token" "text",
    "expires_at" bigint,
    "token_type" "text",
    "scope" "text",
    "id_token" "text",
    "session_state" "text",
    "oauth_token_secret" "text",
    "oauth_token" "text",
    "userId" "uuid"
);

ALTER TABLE "next_auth"."accounts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "expires" timestamp with time zone NOT NULL,
    "sessionToken" "text" NOT NULL,
    "userId" "uuid"
);

ALTER TABLE "next_auth"."sessions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."users" (
    "id" "uuid" NOT NULL,
    "name" "text",
    "email" "text",
    "emailVerified" timestamp with time zone,
    "image" "text",
    "username" "text"
);

ALTER TABLE "next_auth"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."verification_tokens" (
    "identifier" "text",
    "token" "text" NOT NULL,
    "expires" timestamp with time zone NOT NULL
);

ALTER TABLE "next_auth"."verification_tokens" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "providerAccountId" "text" NOT NULL,
    "refresh_token" "text",
    "access_token" "text",
    "expires_at" bigint,
    "token_type" "text",
    "scope" "text",
    "id_token" "text",
    "session_state" "text",
    "oauth_token_secret" "text",
    "oauth_token" "text",
    "userId" "uuid"
);

ALTER TABLE "public"."accounts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text" NOT NULL,
    "feed_id" "uuid" NOT NULL,
    "parent_id" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."comments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."feed_collections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid",
    "feed_id" "uuid"
);

ALTER TABLE "public"."feed_collections" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."feed_engagement" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "feed_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "state" "public"."state" DEFAULT 'neutral'::"public"."state"
);

ALTER TABLE ONLY "public"."feed_engagement" REPLICA IDENTITY FULL;

ALTER TABLE "public"."feed_engagement" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."feed_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "feed_id" "uuid" NOT NULL,
    "image" "text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."feed_images" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."feed_medias" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "title" "text",
    "domain" "text",
    "video" "text",
    "feed_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."feed_medias" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."feeds" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "user_id_public" "uuid",
    "privacy" "public"."feed_privacy" DEFAULT 'public'::"public"."feed_privacy" NOT NULL,
    "status" "public"."feed_status" DEFAULT 'active'::"public"."feed_status" NOT NULL,
    "parent_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "public"."type" DEFAULT 'feed'::"public"."type" NOT NULL,
    "pin" boolean DEFAULT false,
    CONSTRAINT "feeds_content_check" CHECK (("char_length"("content") <= 300))
);

ALTER TABLE ONLY "public"."feeds" REPLICA IDENTITY FULL;

ALTER TABLE "public"."feeds" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "text",
    "new_record" "jsonb",
    "old_record" "jsonb"
);

ALTER TABLE "public"."logs" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "text" NOT NULL,
    "status" boolean DEFAULT false NOT NULL,
    "user_id" "uuid",
    "updated_at" timestamp with time zone,
    "feed_id" "uuid",
    "comment_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_noti_id" "uuid",
    "following_id" "uuid",
    "read" boolean DEFAULT false NOT NULL,
    "state" "public"."state"
);

ALTER TABLE ONLY "public"."notifications" REPLICA IDENTITY FULL;

ALTER TABLE "public"."notifications" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."record_version" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "record_id" "uuid",
    "old_record_id" "uuid",
    "op" character varying(8) NOT NULL,
    "ts" timestamp with time zone DEFAULT "now"() NOT NULL,
    "table_oid" "uuid" NOT NULL,
    "table_name" "text" NOT NULL,
    "record" "jsonb",
    "old_record" "jsonb"
);

ALTER TABLE "public"."record_version" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."report" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "text"
);

ALTER TABLE "public"."report" OWNER TO "postgres";

ALTER TABLE "public"."report" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."report_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "expires" timestamp with time zone NOT NULL,
    "sessionToken" "text" NOT NULL,
    "userId" "uuid"
);

ALTER TABLE "public"."sessions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_follows" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "following_id" "uuid" NOT NULL
);

ALTER TABLE "public"."user_follows" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."verification_tokens" (
    "identifier" "text",
    "token" "text" NOT NULL,
    "expires" timestamp with time zone NOT NULL
);

ALTER TABLE "public"."verification_tokens" OWNER TO "postgres";

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "email_unique" UNIQUE ("email");

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "provider_unique" UNIQUE ("provider", "providerAccountId");

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessiontoken_unique" UNIQUE ("sessionToken");

ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "token_identifier_unique" UNIQUE ("token", "identifier");

ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("token");

ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."feed_collections"
    ADD CONSTRAINT "feed_collections_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."feed_images"
    ADD CONSTRAINT "feed_images_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."feed_medias"
    ADD CONSTRAINT "feed_medias_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."feed_engagement"
    ADD CONSTRAINT "feed_reactions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."feeds"
    ADD CONSTRAINT "feeds_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."logs"
    ADD CONSTRAINT "logs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("full_name");

ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "provider_unique" UNIQUE ("provider", "providerAccountId");

ALTER TABLE ONLY "public"."record_version"
    ADD CONSTRAINT "record_version_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."report"
    ADD CONSTRAINT "report_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessiontoken_unique" UNIQUE ("sessionToken");

ALTER TABLE ONLY "public"."verification_tokens"
    ADD CONSTRAINT "token_identifier_unique" UNIQUE ("token", "identifier");

ALTER TABLE ONLY "public"."feed_collections"
    ADD CONSTRAINT "unique_feed_collections" UNIQUE ("user_id", "feed_id");

ALTER TABLE ONLY "public"."feed_engagement"
    ADD CONSTRAINT "unique_feed_engagement" UNIQUE ("user_id", "feed_id");

ALTER TABLE ONLY "public"."feed_engagement"
    ADD CONSTRAINT "unique_people" UNIQUE ("user_id", "feed_id");

ALTER TABLE ONLY "public"."user_follows"
    ADD CONSTRAINT "user_follows_pkey" PRIMARY KEY ("user_id", "following_id");

ALTER TABLE ONLY "public"."verification_tokens"
    ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("token");

CREATE INDEX "ix_name_display_name" ON "public"."profiles" USING "pgroonga" ("display_name", "full_name");

CREATE INDEX "ix_name_full_name" ON "public"."profiles" USING "pgroonga" ("full_name");

CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "next_auth"."users" FOR EACH ROW EXECUTE FUNCTION "next_auth"."handle_new_user"();

CREATE OR REPLACE TRIGGER "on_notifications_actions_comments_created" AFTER INSERT ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."handle_notifications"();

CREATE OR REPLACE TRIGGER "on_notifications_actions_created" AFTER INSERT ON "public"."feed_engagement" FOR EACH ROW EXECUTE FUNCTION "public"."handle_notifications"();

CREATE OR REPLACE TRIGGER "on_notifications_actions_feeds_comments_created" AFTER INSERT ON "public"."feeds" FOR EACH ROW EXECUTE FUNCTION "public"."handle_notifications"();

CREATE OR REPLACE TRIGGER "on_notifications_actions_user_follows_created" AFTER INSERT ON "public"."user_follows" FOR EACH ROW EXECUTE FUNCTION "public"."handle_notifications"();


ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "next_auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "next_auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."feed_collections"
    ADD CONSTRAINT "feed_collections_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."feed_collections"
    ADD CONSTRAINT "feed_collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."feed_engagement"
    ADD CONSTRAINT "feed_engagement_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."feed_engagement"
    ADD CONSTRAINT "feed_engagement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."feed_images"
    ADD CONSTRAINT "feed_images_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."feeds"
    ADD CONSTRAINT "feeds_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."feeds"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."feeds"
    ADD CONSTRAINT "feeds_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."feeds"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_follows"
    ADD CONSTRAINT "user_follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_follows"
    ADD CONSTRAINT "user_follows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon" ON "public"."accounts" FOR SELECT USING (true);

CREATE POLICY "anon" ON "public"."feed_images" FOR SELECT TO "anon" USING (true);

CREATE POLICY "anon" ON "public"."notifications" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_noti_id"));

CREATE POLICY "authenticated" ON "public"."feed_images" TO "authenticated", "authenticator" USING (true);

CREATE POLICY "authenticated" ON "public"."notifications" TO "authenticated" USING (("auth"."uid"() = "user_noti_id"));

CREATE POLICY "comment_anon" ON "public"."comments" FOR SELECT TO "anon" USING (true);

CREATE POLICY "comments_authenticated" ON "public"."comments" TO "authenticated", "authenticator" USING (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."feed_images" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."feed_medias" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."logs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "next_auth" TO "service_role";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "next_auth"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "next_auth"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "next_auth"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."count_descendant_feeds"("feed_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."count_descendant_feeds"("feed_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."count_descendant_feeds"("feed_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."create_nanoid"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_nanoid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_nanoid"() TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON FUNCTION "public"."find_profiles_and_feeds"("search_term" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."find_profiles_and_feeds"("search_term" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_profiles_and_feeds"("search_term" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_feed_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_feed_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_feed_count"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_users_with_most_posts"("limitdata" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_users_with_most_posts"("limitdata" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_users_with_most_posts"("limitdata" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_notifications"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_notifications"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_notifications"() TO "service_role";

GRANT ALL ON FUNCTION "public"."nanoid"("size" integer, "alphabet" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."nanoid"("size" integer, "alphabet" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."nanoid"("size" integer, "alphabet" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."search_default"("user_id_in" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."search_default"("user_id_in" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_default"("user_id_in" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."uid"() TO "anon";
GRANT ALL ON FUNCTION "public"."uid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uid"() TO "service_role";

GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "service_role";

GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."update_notifications_status"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_notifications_status"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_notifications_status"("user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text", "user_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text", "user_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text", "user_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text", "user_id" "uuid") TO "service_role";

GRANT ALL ON TABLE "next_auth"."accounts" TO "service_role";

GRANT ALL ON TABLE "next_auth"."sessions" TO "service_role";

GRANT ALL ON TABLE "next_auth"."users" TO "service_role";

GRANT ALL ON TABLE "next_auth"."verification_tokens" TO "service_role";

GRANT ALL ON TABLE "public"."accounts" TO "anon";
GRANT ALL ON TABLE "public"."accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."accounts" TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON TABLE "public"."feed_collections" TO "anon";
GRANT ALL ON TABLE "public"."feed_collections" TO "authenticated";
GRANT ALL ON TABLE "public"."feed_collections" TO "service_role";

GRANT ALL ON TABLE "public"."feed_engagement" TO "anon";
GRANT ALL ON TABLE "public"."feed_engagement" TO "authenticated";
GRANT ALL ON TABLE "public"."feed_engagement" TO "service_role";

GRANT ALL ON TABLE "public"."feed_images" TO "anon";
GRANT ALL ON TABLE "public"."feed_images" TO "authenticated";
GRANT ALL ON TABLE "public"."feed_images" TO "service_role";

GRANT ALL ON TABLE "public"."feed_medias" TO "anon";
GRANT ALL ON TABLE "public"."feed_medias" TO "authenticated";
GRANT ALL ON TABLE "public"."feed_medias" TO "service_role";

GRANT ALL ON TABLE "public"."feeds" TO "anon";
GRANT ALL ON TABLE "public"."feeds" TO "authenticated";
GRANT ALL ON TABLE "public"."feeds" TO "service_role";

GRANT ALL ON TABLE "public"."logs" TO "anon";
GRANT ALL ON TABLE "public"."logs" TO "authenticated";
GRANT ALL ON TABLE "public"."logs" TO "service_role";

GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";

GRANT ALL ON TABLE "public"."record_version" TO "anon";
GRANT ALL ON TABLE "public"."record_version" TO "authenticated";
GRANT ALL ON TABLE "public"."record_version" TO "service_role";

GRANT ALL ON TABLE "public"."report" TO "anon";
GRANT ALL ON TABLE "public"."report" TO "authenticated";
GRANT ALL ON TABLE "public"."report" TO "service_role";

GRANT ALL ON SEQUENCE "public"."report_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."report_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."report_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";

GRANT ALL ON TABLE "public"."user_follows" TO "anon";
GRANT ALL ON TABLE "public"."user_follows" TO "authenticated";
GRANT ALL ON TABLE "public"."user_follows" TO "service_role";

GRANT ALL ON TABLE "public"."verification_tokens" TO "anon";
GRANT ALL ON TABLE "public"."verification_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."verification_tokens" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
