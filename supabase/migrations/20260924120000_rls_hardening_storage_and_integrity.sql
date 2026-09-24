-- RLS hardening, storage ownership and data-integrity fixes (2026-09 upgrade).
--
-- Builds on 20260804154419_enable_rls_legacy_tables.sql. Safe to run on a
-- database where that migration is already applied; every statement is
-- idempotent (enable RLS again, drop-if-exists before re-creating policies).
--
-- NOT applied automatically: run `supabase db push --linked` when ready.
--
-- Summary
--   1. Make sure RLS is enabled on every table in `public`.
--   2. feeds: respect `privacy` (public / follow / private) in SELECT.
--   3. feed_collections: saved posts are private to their owner; no duplicates.
--   4. report: track the reporter (user_id default auth.uid()); users only see
--      their own reports (previously every signed-in user could read all).
--   5. user_follows: no self-follows.
--   6. feeds.content: the 300-char limit applied to stored HTML (TipTap markup,
--      YouTube embeds), so near-limit posts failed. Plain-text length is now
--      validated by the app (300); the DB caps the HTML at 5000.
--   7. handle_new_user(): stop copying the OAuth display name into the unique
--      `full_name` (username) column. Two users with the same Google/Facebook
--      name made sign-up fail; the app now assigns a unique slug on first login.
--   8. Storage: create the `avatars` / `suzu` buckets if missing and replace the
--      wide-open policies (anyone could overwrite/delete any file) with
--      owner-based ones. New uploads live under `<user_id>/...`.

-- ------------------------------------------------------------------ 1. RLS on
do $$
declare
  t record;
begin
  for t in
    select tablename from pg_tables where schemaname = 'public'
  loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end
$$;

-- ------------------------------------------------------- 2. feeds privacy read
drop policy if exists "feeds_select" on public.feeds;
create policy "feeds_select" on public.feeds
    for select to anon, authenticated
    using (
      privacy = 'public'
      or user_id = (select auth.uid())
      or (
        privacy = 'follow'
        and exists (
          select 1 from public.user_follows uf
          where uf.following_id = feeds.user_id
            and uf.user_id = (select auth.uid())
        )
      )
    );

create index if not exists "user_follows_following_id_idx"
    on public.user_follows using btree (following_id);

-- ------------------------------------------------ 3. feed_collections private
-- Remove duplicate saves (keep the oldest row) before adding the unique index.
delete from public.feed_collections a
using public.feed_collections b
where a.user_id = b.user_id
  and a.feed_id = b.feed_id
  and (a.created_at, a.id) > (b.created_at, b.id);

create unique index if not exists "feed_collections_user_feed_key"
    on public.feed_collections using btree (user_id, feed_id);

drop policy if exists "feed_collections_select" on public.feed_collections;
create policy "feed_collections_select" on public.feed_collections
    for select to authenticated
    using ((select auth.uid()) = user_id);

-- Anonymous visitors never write; tighten the broad table grants.
revoke insert, update, delete, truncate, references, trigger
    on table public.feed_collections from anon;
revoke insert, update, delete, truncate, references, trigger
    on table public.comment_engagement from anon;

-- ----------------------------------------------------------------- 4. report
alter table public.report
    add column if not exists user_id uuid default auth.uid()
    references public.profiles (id) on update cascade on delete set null;

create index if not exists "report_user_id_idx" on public.report using btree (user_id);

drop policy if exists "report_insert" on public.report;
create policy "report_insert" on public.report
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists "report_select" on public.report;
create policy "report_select" on public.report
    for select to authenticated
    using ((select auth.uid()) = user_id);

-- ------------------------------------------------------------ 5. self-follow
alter table public.user_follows drop constraint if exists "user_follows_no_self_follow";
alter table public.user_follows
    add constraint "user_follows_no_self_follow"
    check (user_id <> following_id) not valid;

-- ------------------------------------------------------ 6. feeds content size
alter table public.feeds drop constraint if exists "feeds_content_check";
alter table public.feeds
    add constraint "feeds_content_check"
    check (char_length(content) <= 5000);

-- --------------------------------------------------- 7. OAuth sign-up profile
create or replace function public.handle_new_user()
 returns trigger
 language plpgsql
 security definer
 set search_path to ''
as $function$
begin
  if new.raw_app_meta_data->>'provider' in ('google', 'facebook') then
    -- full_name is the unique username; it is assigned by the app callback.
    insert into public.profiles (id, display_name, avatar_url, email)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
      new.raw_user_meta_data->>'avatar_url',
      new.email
    );
  else
    insert into public.profiles (id, display_name, email)
    values (new.id, new.email, new.email);
  end if;
  return new;
end;
$function$;

revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- ---------------------------------------------------------------- 8. storage
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('suzu', 'suzu', true)
on conflict (id) do nothing;

drop policy if exists "avatar 1oj01fe_0" on storage.objects;
drop policy if exists "avatar 1oj01fe_1" on storage.objects;
drop policy if exists "avatar 1oj01fe_2" on storage.objects;
drop policy if exists "avatar 1oj01fe_3" on storage.objects;
drop policy if exists "avatars 1oj01fe_0" on storage.objects;
drop policy if exists "avatars 1oj01fe_1" on storage.objects;
drop policy if exists "avatars 1oj01fe_2" on storage.objects;
drop policy if exists "avatars 1oj01fe_3" on storage.objects;
drop policy if exists "crud-suzu-storage 23x99_0" on storage.objects;
drop policy if exists "crud-suzu-storage 23x99_1" on storage.objects;
drop policy if exists "crud-suzu-storage 23x99_2" on storage.objects;
drop policy if exists "crud-suzu-storage 23x99_3" on storage.objects;
drop policy if exists "suzu-bucket-anon 23x99_0" on storage.objects;

drop policy if exists "media_public_read" on storage.objects;
drop policy if exists "media_owner_insert" on storage.objects;
drop policy if exists "media_owner_update" on storage.objects;
drop policy if exists "media_owner_delete" on storage.objects;

-- Buckets are public (files are served by URL); listing is limited to them.
create policy "media_public_read" on storage.objects
    for select to anon, authenticated
    using (bucket_id in ('avatars', 'suzu'));

-- Uploads must go into the uploader's own folder: <auth.uid()>/<file>.
create policy "media_owner_insert" on storage.objects
    for insert to authenticated
    with check (
      bucket_id in ('avatars', 'suzu')
      and (storage.foldername(name))[1] = (select auth.uid())::text
    );

-- Update/delete: files in the user's folder, or legacy files they uploaded
-- (storage sets owner_id to the uploader).
create policy "media_owner_update" on storage.objects
    for update to authenticated
    using (
      bucket_id in ('avatars', 'suzu')
      and (
        (storage.foldername(name))[1] = (select auth.uid())::text
        or owner_id = (select auth.uid())::text
      )
    )
    with check (
      bucket_id in ('avatars', 'suzu')
      and (storage.foldername(name))[1] = (select auth.uid())::text
    );

create policy "media_owner_delete" on storage.objects
    for delete to authenticated
    using (
      bucket_id in ('avatars', 'suzu')
      and (
        (storage.foldername(name))[1] = (select auth.uid())::text
        or owner_id = (select auth.uid())::text
      )
    );
