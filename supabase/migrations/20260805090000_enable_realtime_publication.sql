-- Enable realtime (postgres_changes) for the tables the app subscribes to.
-- RLS still applies: subscribers only receive rows their SELECT policies allow.
do $$
declare
  t text;
begin
  foreach t in array array[
    'feeds',
    'comments',
    'feed_engagement',
    'comment_engagement',
    'feed_collections',
    'notifications',
    'user_follows'
  ]
  loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end
$$;
