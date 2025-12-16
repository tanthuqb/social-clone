## Deploy Supabase Server

step 1 : pull code deploy from github with branch staging

```
git clone --single-branch --branch stagging  https://github.com/SuZuGroup/suzu.net.turborepo.git
```

step 2 : install supabase cli [CLI Supbase] (https://supabase.com/docs/guides/cli/getting-started) or command line :

```
npx supabase login
```

step 3 : After install supabase cli run command to init ( if have error Project already initialized Remove supabase\config.toml)

```
supabase init
```

step 4 : Finished supabase init . Run command to start (note : run docker before start)

```
supabase start
```

step 4 : Finished docker run . Update file env and Open browser with url http://localhost:54323

Final : Update setting supabase ( provider , email , role ...)

## Deploy Supabase Server
