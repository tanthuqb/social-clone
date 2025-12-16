import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const { searchParams, origin } = new URL(request.url)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user) {
  //   // return NextResponse.redirect(process.env.NEXTAUTH_URL!);
  //   console.log('User not found');
  // }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};