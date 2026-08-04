-- Function security hardening (advisor findings):
--   1. Revoke public EXECUTE on internal SECURITY DEFINER functions.
--      Trigger execution is unaffected: EXECUTE is only checked when a
--      trigger is created, not when it fires.
--   2. Pin search_path on functions that lacked it (mutable search_path WARN).
--      Bodies reference unqualified public tables, so pin to 'public'.

-- verify_user_password takes (password, user_id) and compares against
-- auth.users — a password brute-force oracle if callable by anon. The app
-- never calls it; lock it down.
revoke execute on function public.verify_user_password(text, text) from anon, authenticated, public;

-- Trigger-only functions: not meant to be called via /rest/v1/rpc/.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.handle_notifications() from anon, authenticated, public;
revoke execute on function next_auth.handle_new_user() from anon, authenticated, public;

-- Pin search_path (advisor: function_search_path_mutable).
alter function public.handle_notifications() set search_path = public;
alter function public.count_descendant_feeds(uuid) set search_path = public;
alter function public.find_profiles_and_feeds(text) set search_path = public;
alter function public.get_users_with_most_posts(bigint) set search_path = public;
alter function public.search_default(uuid) set search_path = public;
alter function public.verify_user_password(text, text) set search_path = extensions, public;
alter function next_auth.handle_new_user() set search_path = '';
alter function next_auth.uid() set search_path = '';
