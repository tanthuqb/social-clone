-- Add tables used by the app but missing from the remote schema:
--   feed_collections  (save/bookmark feeds)
--   comment_engagement (reactions on comments)

create table "public"."feed_collections" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "feed_id" uuid,
    "user_id" uuid
);

alter table "public"."feed_collections"
    add constraint "feed_collections_pkey" primary key ("id");

alter table "public"."feed_collections"
    add constraint "feed_collections_feed_id_fkey" foreign key ("feed_id")
    references public.feeds (id) on update cascade on delete cascade;

alter table "public"."feed_collections"
    add constraint "feed_collections_user_id_fkey" foreign key ("user_id")
    references public.profiles (id) on update cascade on delete cascade;

create index "feed_collections_feed_id_idx" on public.feed_collections using btree (feed_id);
create index "feed_collections_user_id_idx" on public.feed_collections using btree (user_id);

create table "public"."comment_engagement" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "comment_id" uuid not null,
    "user_id" uuid not null,
    "state" public.state
);

alter table "public"."comment_engagement"
    add constraint "comment_engagement_pkey" primary key ("id");

alter table "public"."comment_engagement"
    add constraint "comment_reactions_comment_id_fkey" foreign key ("comment_id")
    references public.comments (id) on update cascade on delete cascade;

alter table "public"."comment_engagement"
    add constraint "comment_engagement_user_id_fkey" foreign key ("user_id")
    references public.profiles (id) on update cascade on delete cascade;

create index "comment_engagement_comment_id_idx" on public.comment_engagement using btree (comment_id);
create index "comment_engagement_user_id_idx" on public.comment_engagement using btree (user_id);

grant delete, insert, references, select, trigger, truncate, update on table "public"."feed_collections" to "anon";
grant delete, insert, references, select, trigger, truncate, update on table "public"."feed_collections" to "authenticated";
grant delete, insert, references, select, trigger, truncate, update on table "public"."feed_collections" to "service_role";

grant delete, insert, references, select, trigger, truncate, update on table "public"."comment_engagement" to "anon";
grant delete, insert, references, select, trigger, truncate, update on table "public"."comment_engagement" to "authenticated";
grant delete, insert, references, select, trigger, truncate, update on table "public"."comment_engagement" to "service_role";

-- RLS: public read (feed detail pages are visible to anonymous visitors),
-- writes restricted to the owning user.
alter table "public"."feed_collections" enable row level security;
alter table "public"."comment_engagement" enable row level security;

create policy "feed_collections_select" on "public"."feed_collections"
    for select to anon, authenticated
    using (true);

create policy "feed_collections_insert" on "public"."feed_collections"
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "feed_collections_update" on "public"."feed_collections"
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "feed_collections_delete" on "public"."feed_collections"
    for delete to authenticated
    using ((select auth.uid()) = user_id);

create policy "comment_engagement_select" on "public"."comment_engagement"
    for select to anon, authenticated
    using (true);

create policy "comment_engagement_insert" on "public"."comment_engagement"
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "comment_engagement_update" on "public"."comment_engagement"
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "comment_engagement_delete" on "public"."comment_engagement"
    for delete to authenticated
    using ((select auth.uid()) = user_id);
