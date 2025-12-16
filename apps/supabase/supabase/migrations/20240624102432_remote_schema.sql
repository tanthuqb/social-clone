set check_function_bodies = off;

CREATE OR REPLACE FUNCTION next_auth.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
 insert into next_auth.users (id)
  values (new.id);
  return new;
end;$function$
;


drop function if exists "public"."nanoid"(size integer, alphabet text);

drop function if exists "public"."verify_user_password"(password text, user_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.count_descendant_feeds(feed_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.create_nanoid()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.find_profiles_and_feeds(search_term text)
 RETURNS SETOF profiles
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_users_with_most_posts(limitdata bigint)
 RETURNS SETOF profiles
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_notifications()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.search_default(user_id_in uuid)
 RETURNS SETOF profiles
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.uid()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$function$
;

CREATE OR REPLACE FUNCTION public.update_notifications_status(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.verify_user_password(password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = auth.uid() AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.verify_user_password(password text, user_id text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = user_id AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.verify_user_password(password text, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = user_id AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$function$
;

CREATE TRIGGER "push-notifications" AFTER INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://wtuxkawucgrqepemujjf.supabase.co/functions/v1/push-notifications', 'POST', '{"Content-type":"application/json"}', '{}', '1000');


