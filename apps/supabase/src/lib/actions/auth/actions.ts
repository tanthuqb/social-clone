'use server'
import { createClient } from '@/lib/supabase/server';
import { Provider } from '@supabase/supabase-js'
import { redirect } from 'next/navigation';
import { getURL } from '@/lib/ultis';

export async function oAuthSignIn(provider: Provider) {

  if (!provider) {
      console.error('No provider specified')
      return redirect('/auth/error')
  }

  const supabase = createClient();
  const redirectUrl = getURL("/api/auth/callback")
  const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
          redirectTo: redirectUrl,
      }
  })

  if (error) {
      redirect('/login?message=Could not authenticate user')
  }

  return redirect(data.url)
}

export async function logout() {
    const supabase = createClient()
  
    await supabase.auth.signOut()
  
    redirect('/')
  }

export async function checkAuth() {
    const supabase = createClient()
    const { data: session , error } = await supabase.auth.getSession()
  
    if (!session) {
      redirect('/login')
    }
  }