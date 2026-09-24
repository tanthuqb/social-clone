-- Hide posts, block users, report posts/users and privacy settings.
--
-- Builds on 20260924120000_rls_hardening_storage_and_integrity.sql (report.user_id,
-- feeds privacy policy). Every statement is idempotent: re-running the file is a
-- no-op. NOT applied automatically: run `supabase db push --linked` when ready.
--
-- Summary
--   1. private schema for SECURITY DEFINER helpers (never exposed by the API).
--   2. profiles: default_post_privacy, profile_visibility, comment_permission.
--   3. hidden_feeds: per-user hidden posts (hidden for that user only).
--   4. user_blocks: blocking removes follows both ways and hides posts, comments,
--      reactions and notifications between the two users.
--   5. report: feed_id / reported_user_id / reason, one report per target and user.
--   6. RLS: feeds / comments / feed_engagement / comment_engagement / user_follows /
--      notifications enforce blocks, hidden posts and privacy settings.
--   7. handle_notifications(): no notifications between blocked users.

-- ------------------------------------------------------------ 1. private schema
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

-- ----------------------------------------------------------- 2. privacy settings
do $$
begin
  create type public.profile_visibility as enum ('public', 'followers');
exception when duplicate_object then null;
end
$$;

do $$
begin
  create type public.comment_permission as enum ('everyone', 'followers', 'nobody');
exception when duplicate_object then null;
end
$$;

alter table public.profiles
    add column if not exists default_post_privacy public.feed_privacy not null default 'public',
    add column if not exists profile_visibility public.profile_visibility not null default 'public',
    add column if not exists comment_permission public.comment_permission not null default 'everyone';

comment on column public.profiles.default_post_privacy is 'Privacy preselected in the post composer.';
comment on column public.profiles.profile_visibility is 'followers: only followers (and the owner) see this user''s posts.';
comment on column public.profiles.comment_permission is 'Who can comment on (and reply under) this user''s posts.';

-- ---------------------------------------------------------------- 3. hidden_feeds
create table if not exists public.hidden_feeds (
    user_id uuid not null default auth.uid()
        references public.profiles (id) on update cascade on delete cascade,
    feed_id uuid not null
        references public.feeds (id) on update cascade on delete cascade,
    created_at timestamp with time zone not null default now(),
    constraint hidden_feeds_pkey primary key (user_id, feed_id)
);

create index if not exists hidden_feeds_feed_id_idx on public.hidden_feeds using btree (feed_id);

alter table public.hidden_feeds enable row level security;

-- anon keeps SELECT only because the feeds policy reads this table (no rows match).
revoke all on table public.hidden_feeds from anon, authenticated;
grant select on table public.hidden_feeds to anon;
grant select, insert, delete on table public.hidden_feeds to authenticated;
grant all on table public.hidden_feeds to service_role;

drop policy if exists "hidden_feeds_select" on public.hidden_feeds;
create policy "hidden_feeds_select" on public.hidden_feeds
    for select to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "hidden_feeds_insert" on public.hidden_feeds;
create policy "hidden_feeds_insert" on public.hidden_feeds
    for insert to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists "hidden_feeds_delete" on public.hidden_feeds;
create policy "hidden_feeds_delete" on public.hidden_feeds
    for delete to authenticated
    using ((select auth.uid()) = user_id);

-- ----------------------------------------------------------------- 4. user_blocks
create table if not exists public.user_blocks (
    blocker_id uuid not null default auth.uid()
        references public.profiles (id) on update cascade on delete cascade,
    blocked_id uuid not null
        references public.profiles (id) on update cascade on delete cascade,
    created_at timestamp with time zone not null default now(),
    constraint user_blocks_pkey primary key (blocker_id, blocked_id),
    constraint user_blocks_no_self_block check (blocker_id <> blocked_id)
);

create index if not exists user_blocks_blocked_id_idx on public.user_blocks using btree (blocked_id);

alter table public.user_blocks enable row level security;

revoke all on table public.user_blocks from anon, authenticated;
grant select, insert, delete on table public.user_blocks to authenticated;
grant all on table public.user_blocks to service_role;

-- Both sides can see the block (the app shows "you can't interact"); only the
-- blocker can create or remove it.
drop policy if exists "user_blocks_select" on public.user_blocks;
create policy "user_blocks_select" on public.user_blocks
    for select to authenticated
    using ((select auth.uid()) in (blocker_id, blocked_id));

drop policy if exists "user_blocks_insert" on public.user_blocks;
create policy "user_blocks_insert" on public.user_blocks
    for insert to authenticated
    with check ((select auth.uid()) = blocker_id);

drop policy if exists "user_blocks_delete" on public.user_blocks;
create policy "user_blocks_delete" on public.user_blocks
    for delete to authenticated
    using ((select auth.uid()) = blocker_id);

-- ------------------------------------------------------------- helper functions
-- Internal: is there a block between two users (either direction)?
create or replace function private.is_blocked_pair(a uuid, b uuid)
 returns boolean
 language sql
 stable
 security definer
 set search_path to ''
as $function$
  select exists (
    select 1 from public.user_blocks ub
    where (ub.blocker_id = a and ub.blocked_id = b)
       or (ub.blocker_id = b and ub.blocked_id = a)
  );
$function$;

revoke execute on function private.is_blocked_pair(uuid, uuid) from public, anon, authenticated;

-- RLS helper: is the current user blocking / blocked by `other`?
create or replace function private.has_block_with(other uuid)
 returns boolean
 language sql
 stable
 security definer
 set search_path to ''
as $function$
  select (select auth.uid()) is not null
     and other is not null
     and exists (
       select 1 from public.user_blocks ub
       where (ub.blocker_id = (select auth.uid()) and ub.blocked_id = other)
          or (ub.blocked_id = (select auth.uid()) and ub.blocker_id = other)
     );
$function$;

revoke execute on function private.has_block_with(uuid) from public;
grant execute on function private.has_block_with(uuid) to anon, authenticated, service_role;

-- RLS helper: may the current user comment on / reply under `target`
-- (a post or a comment)? Rules come from the root post and its author:
-- no block with the root author or the direct parent author, the root post is
-- visible to the user, and the author's comment_permission allows it.
create or replace function private.can_comment_on(target uuid)
 returns boolean
 language plpgsql
 stable
 security definer
 set search_path to ''
as $function$
declare
  me uuid := (select auth.uid());
  parent_author uuid;
  root_author uuid;
  root_privacy public.feed_privacy;
  author_visibility public.profile_visibility;
  author_permission public.comment_permission;
  is_follower boolean;
begin
  if me is null or target is null then
    return false;
  end if;

  select f.user_id into parent_author from public.feeds f where f.id = target;
  if parent_author is null then
    return false;
  end if;
  if parent_author <> me and private.is_blocked_pair(me, parent_author) then
    return false;
  end if;

  with recursive chain as (
    select f.id, f.parent_id, f.user_id, f.privacy, 0 as depth
    from public.feeds f
    where f.id = target
    union all
    select f.id, f.parent_id, f.user_id, f.privacy, c.depth + 1
    from public.feeds f
    join chain c on f.id = c.parent_id
    where c.depth < 50
  )
  select c.user_id, c.privacy into root_author, root_privacy
  from chain c
  where c.parent_id is null
  limit 1;

  if root_author is null then
    return false;
  end if;
  if root_author = me then
    return true;
  end if;
  if private.is_blocked_pair(me, root_author) then
    return false;
  end if;

  select p.profile_visibility, p.comment_permission
    into author_visibility, author_permission
  from public.profiles p
  where p.id = root_author;

  is_follower := exists (
    select 1 from public.user_follows uf
    where uf.user_id = me and uf.following_id = root_author
  );

  if root_privacy = 'private' then
    return false;
  end if;
  if (root_privacy = 'follow' or author_visibility = 'followers') and not is_follower then
    return false;
  end if;

  return case coalesce(author_permission, 'everyone')
    when 'everyone' then true
    when 'followers' then is_follower
    else false
  end;
end;
$function$;

revoke execute on function private.can_comment_on(uuid) from public;
grant execute on function private.can_comment_on(uuid) to authenticated, service_role;

-- Blocking removes follows both ways and notifications between the two users.
create or replace function private.handle_user_block()
 returns trigger
 language plpgsql
 security definer
 set search_path to ''
as $function$
begin
  delete from public.user_follows
  where (user_id = new.blocker_id and following_id = new.blocked_id)
     or (user_id = new.blocked_id and following_id = new.blocker_id);

  delete from public.notifications
  where (user_id = new.blocker_id and user_noti_id = new.blocked_id)
     or (user_id = new.blocked_id and user_noti_id = new.blocker_id);

  return new;
end;
$function$;

revoke execute on function private.handle_user_block() from public, anon, authenticated;

drop trigger if exists on_user_block_created on public.user_blocks;
create trigger on_user_block_created
    after insert on public.user_blocks
    for each row execute function private.handle_user_block();

-- ------------------------------------------------------------------- 5. report
alter table public.report
    add column if not exists feed_id uuid
        references public.feeds (id) on update cascade on delete cascade,
    add column if not exists reported_user_id uuid
        references public.profiles (id) on update cascade on delete cascade,
    add column if not exists reason text;

alter table public.report drop constraint if exists report_reason_check;
alter table public.report
    add constraint report_reason_check check (
      reason is null or reason in (
        'spam', 'harassment', 'hate_speech', 'violence', 'nudity',
        'false_information', 'fake_account', 'other'
      )
    );

-- Reports about a post or user need a reason; support messages (no target) don't.
alter table public.report drop constraint if exists report_target_reason_check;
alter table public.report
    add constraint report_target_reason_check check (
      (feed_id is null and reported_user_id is null) or reason is not null
    );

alter table public.report drop constraint if exists report_not_self_check;
alter table public.report
    add constraint report_not_self_check check (
      reported_user_id is null or user_id is null or reported_user_id <> user_id
    );

create index if not exists report_feed_id_idx on public.report using btree (feed_id);
create index if not exists report_reported_user_id_idx on public.report using btree (reported_user_id);

-- One report per user and post / per user and profile.
create unique index if not exists report_user_feed_key
    on public.report using btree (user_id, feed_id)
    where feed_id is not null;
create unique index if not exists report_user_reported_user_key
    on public.report using btree (user_id, reported_user_id)
    where reported_user_id is not null and feed_id is null;

-- ------------------------------------------------------------------ 6. policies
-- feeds: owner always; otherwise no block, not hidden by the viewer, and the
-- post privacy + author's profile visibility allow it. Profile visibility only
-- applies to posts: comments on other people's public posts stay visible.
drop policy if exists "feeds_select" on public.feeds;
create policy "feeds_select" on public.feeds
    for select to anon, authenticated
    using (
      user_id = (select auth.uid())
      or (
        not private.has_block_with(user_id)
        and not exists (
          select 1 from public.hidden_feeds h
          where h.user_id = (select auth.uid())
            and h.feed_id = feeds.id
        )
        and (
          (
            privacy = 'public'
            and (
              type = 'comment'
              or exists (
                select 1 from public.profiles p
                where p.id = feeds.user_id
                  and p.profile_visibility = 'public'
              )
              or exists (
                select 1 from public.user_follows uf
                where uf.user_id = (select auth.uid())
                  and uf.following_id = feeds.user_id
              )
            )
          )
          or (
            privacy = 'follow'
            and exists (
              select 1 from public.user_follows uf
              where uf.user_id = (select auth.uid())
                and uf.following_id = feeds.user_id
            )
          )
        )
      )
    );

-- Comments (rows with type = 'comment') obey blocks and comment permissions.
drop policy if exists "feeds_insert" on public.feeds;
create policy "feeds_insert" on public.feeds
    for insert to authenticated
    with check (
      (select auth.uid()) = user_id
      and (
        (type = 'feed' and parent_id is null)
        or (type = 'comment' and private.can_comment_on(parent_id))
      )
    );

-- Legacy comments table: same rules.
drop policy if exists "comments_select" on public.comments;
create policy "comments_select" on public.comments
    for select to anon, authenticated
    using (not private.has_block_with(user_id));

drop policy if exists "comments_insert" on public.comments;
create policy "comments_insert" on public.comments
    for insert to authenticated
    with check (
      (select auth.uid()) = user_id
      and private.can_comment_on(feed_id)
    );

-- Reactions: only on posts/comments the user can see (covers blocks, privacy).
drop policy if exists "feed_engagement_select" on public.feed_engagement;
create policy "feed_engagement_select" on public.feed_engagement
    for select to anon, authenticated
    using (not private.has_block_with(user_id));

drop policy if exists "feed_engagement_insert" on public.feed_engagement;
create policy "feed_engagement_insert" on public.feed_engagement
    for insert to authenticated
    with check (
      (select auth.uid()) = user_id
      and exists (select 1 from public.feeds f where f.id = feed_id)
    );

drop policy if exists "feed_engagement_update" on public.feed_engagement;
create policy "feed_engagement_update" on public.feed_engagement
    for update to authenticated
    using ((select auth.uid()) = user_id)
    with check (
      (select auth.uid()) = user_id
      and exists (select 1 from public.feeds f where f.id = feed_id)
    );

drop policy if exists "comment_engagement_insert" on public.comment_engagement;
create policy "comment_engagement_insert" on public.comment_engagement
    for insert to authenticated
    with check (
      (select auth.uid()) = user_id
      and exists (select 1 from public.comments c where c.id = comment_id)
    );

-- Follows: never between blocked users.
drop policy if exists "user_follows_insert" on public.user_follows;
create policy "user_follows_insert" on public.user_follows
    for insert to authenticated
    with check (
      (select auth.uid()) = user_id
      and not private.has_block_with(following_id)
    );

-- Notifications: hide anything triggered by a blocked/blocking user.
drop policy if exists "notifications_select" on public.notifications;
create policy "notifications_select" on public.notifications
    for select to authenticated
    using (
      (select auth.uid()) = user_noti_id
      and not private.has_block_with(user_id)
    );

-- --------------------------------------------------- 7. notifications trigger
create or replace function public.handle_notifications()
 returns trigger
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  owner_id uuid;
  comment_exist uuid;
  follower record;
begin
  if tg_table_name = 'feeds' then
    if new.type = 'comment' then
      select f.user_id into owner_id from public.feeds f where f.id = new.parent_id;
      if owner_id is not null and not private.is_blocked_pair(new.user_id, owner_id) then
        insert into public.notifications (type, user_id, feed_id, comment_id, user_noti_id)
        values ('comments', new.user_id, new.parent_id, new.id, owner_id);
      end if;
    elsif new.type = 'feed' then
      for follower in
        select uf.user_id from public.user_follows uf
        where uf.following_id = new.user_id
          and not private.is_blocked_pair(uf.user_id, new.user_id)
      loop
        insert into public.notifications (type, user_id, feed_id, user_noti_id)
        values ('feed', new.user_id, new.id, follower.user_id);
      end loop;
    end if;
  elsif tg_table_name = 'feed_engagement' then
    select f.parent_id, f.user_id into comment_exist, owner_id
    from public.feeds f where f.id = new.feed_id;
    if owner_id is not null and not private.is_blocked_pair(new.user_id, owner_id) then
      insert into public.notifications (type, user_id, feed_id, user_noti_id, state)
      values (
        case when comment_exist is not null then 'comment_engagement' else 'feed_engagement' end,
        new.user_id, new.feed_id, owner_id, new.state
      );
    end if;
  elsif tg_table_name = 'user_follows' then
    if not private.is_blocked_pair(new.user_id, new.following_id) then
      insert into public.notifications (type, user_id, following_id, user_noti_id)
      values ('user_follows', new.user_id, new.following_id, new.following_id);
    end if;
  end if;
  return new;
end;
$function$;

revoke execute on function public.handle_notifications() from public, anon, authenticated;
