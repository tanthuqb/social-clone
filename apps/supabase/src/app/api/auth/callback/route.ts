import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/ultis';
import { type NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest) {

  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  if (code) {
    const supbase = createClient();
    const { data, error } = await supbase.auth.exchangeCodeForSession(code)
    if (new Date(data?.user?.confirmed_at as string).getTime() - new Date(data?.user?.created_at as string).getTime() < 1000 * 5) {
      let sameName = false
      const name = slugify(data?.user?.user_metadata.full_name, { replacement: "." });
      let count = 0;
      const { data: updateName, error: duplicateError } = await supbase.from('profiles').update({
        full_name: name
      }).eq('id', data?.user?.id as string)
      if (duplicateError) {
        while (!sameName) {
          const { data: updateName, error } = await supbase.from('profiles').update({
            full_name: name
          }).eq('full_name', name + count)
          count++;
          if (!error) {
            sameName = true
          }
        }
      }
    }
    if (!error) {
      return NextResponse.redirect(`${origin}/${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}