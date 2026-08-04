-- Enable RLS on the legacy public tables and add policies that preserve the
-- app's current access patterns:
--   * content tables are publicly readable (anon visitors can view feeds,
--     profiles, comments and reactions on public pages)
--   * writes are restricted to the owning user (cookie-based Supabase Auth)
--   * notifications are private to their recipient (user_noti_id)
--   * notification rows are inserted by SECURITY DEFINER triggers, which
--     bypass RLS, so no INSERT policy is needed for them

-- ---------------------------------------------------------------- profiles
alter table "public"."profiles" enable row level security;

create policy "profiles_select" on "public"."profiles"
    for select to anon, authenticated
    using (true);

create policy "profiles_insert" on "public"."profiles"
    for insert to authenticated
    with check ((select auth.uid()) = id);

create policy "profiles_update" on "public"."profiles"
    for update to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);

-- ------------------------------------------------------------------- feeds
alter table "public"."feeds" enable row level security;

create policy "feeds_select" on "public"."feeds"
    for select to anon, authenticated
    using (true);

create policy "feeds_insert" on "public"."feeds"
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "feeds_update" on "public"."feeds"
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "feeds_delete" on "public"."feeds"
    for delete to authenticated
    using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------- comments
alter table "public"."comments" enable row level security;

create policy "comments_select" on "public"."comments"
    for select to anon, authenticated
    using (true);

create policy "comments_insert" on "public"."comments"
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "comments_update" on "public"."comments"
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "comments_delete" on "public"."comments"
    for delete to authenticated
    using ((select auth.uid()) = user_id);

-- --------------------------------------------------------- feed_engagement
alter table "public"."feed_engagement" enable row level security;

create policy "feed_engagement_select" on "public"."feed_engagement"
    for select to anon, authenticated
    using (true);

create policy "feed_engagement_insert" on "public"."feed_engagement"
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "feed_engagement_update" on "public"."feed_engagement"
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "feed_engagement_delete" on "public"."feed_engagement"
    for delete to authenticated
    using ((select auth.uid()) = user_id);

-- ------------------------------------------------------------- feed_images
-- Writes allowed for the owner of the parent feed.
alter table "public"."feed_images" enable row level security;

create policy "feed_images_select" on "public"."feed_images"
    for select to anon, authenticated
    using (true);

create policy "feed_images_insert" on "public"."feed_images"
    for insert to authenticated
    with check (
      exists (
        select 1 from public.feeds f
        where f.id = feed_id and f.user_id = (select auth.uid())
      )
    );

create policy "feed_images_update" on "public"."feed_images"
    for update to authenticated
    using (
      exists (
        select 1 from public.feeds f
        where f.id = feed_id and f.user_id = (select auth.uid())
      )
    )
    with check (
      exists (
        select 1 from public.feeds f
        where f.id = feed_id and f.user_id = (select auth.uid())
      )
    );

create policy "feed_images_delete" on "public"."feed_images"
    for delete to authenticated
    using (
      exists (
        select 1 from public.feeds f
        where f.id = feed_id and f.user_id = (select auth.uid())
      )
    );

-- ------------------------------------------------------------- feed_medias
alter table "public"."feed_medias" enable row level security;

create policy "feed_medias_select" on "public"."feed_medias"
    for select to anon, authenticated
    using (true);

create policy "feed_medias_insert" on "public"."feed_medias"
    for insert to authenticated
    with check (
      exists (
        select 1 from public.feeds f
        where f.id = feed_id and f.user_id = (select auth.uid())
      )
    );

create policy "feed_medias_update" on "public"."feed_medias"
    for update to authenticated
    using (
      exists (
        select 1 from public.feeds f
        where f.id = feed_id and f.user_id = (select auth.uid())
      )
    )
    with check (
      exists (
        select 1 from public.feeds f
        where f.id = feed_id and f.user_id = (select auth.uid())
      )
    );

create policy "feed_medias_delete" on "public"."feed_medias"
    for delete to authenticated
    using (
      exists (
        select 1 from public.feeds f
        where f.id = feed_id and f.user_id = (select auth.uid())
      )
    );

-- ------------------------------------------------------------ user_follows
alter table "public"."user_follows" enable row level security;

create policy "user_follows_select" on "public"."user_follows"
    for select to anon, authenticated
    using (true);

create policy "user_follows_insert" on "public"."user_follows"
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "user_follows_delete" on "public"."user_follows"
    for delete to authenticated
    using ((select auth.uid()) = user_id);

-- ----------------------------------------------------------- notifications
-- Recipient column is user_noti_id; rows are created by SECURITY DEFINER
-- trigger functions (bypass RLS). Recipients can read, mark as read, delete.
alter table "public"."notifications" enable row level security;

create policy "notifications_select" on "public"."notifications"
    for select to authenticated
    using ((select auth.uid()) = user_noti_id);

create policy "notifications_update" on "public"."notifications"
    for update to authenticated
    using ((select auth.uid()) = user_noti_id)
    with check ((select auth.uid()) = user_noti_id);

create policy "notifications_delete" on "public"."notifications"
    for delete to authenticated
    using ((select auth.uid()) = user_noti_id);

-- ------------------------------------------------------------------ report
-- Support form: signed-in users can file a report. SELECT is granted to
-- authenticated because the app inserts with `.select()` (RETURNING).
alter table "public"."report" enable row level security;

create policy "report_insert" on "public"."report"
    for insert to authenticated
    with check (true);

create policy "report_select" on "public"."report"
    for select to authenticated
    using (true);

-- -------------------------------------------- indexes for policy predicates
create index if not exists "feeds_user_id_idx" on public.feeds using btree (user_id);
create index if not exists "comments_user_id_idx" on public.comments using btree (user_id);
create index if not exists "comments_feed_id_idx" on public.comments using btree (feed_id);
create index if not exists "feed_engagement_feed_id_idx" on public.feed_engagement using btree (feed_id);
create index if not exists "feed_images_feed_id_idx" on public.feed_images using btree (feed_id);
create index if not exists "feed_medias_feed_id_idx" on public.feed_medias using btree (feed_id);
create index if not exists "notifications_user_noti_id_idx" on public.notifications using btree (user_noti_id);
