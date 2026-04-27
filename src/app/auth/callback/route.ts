import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`)
      // Ensure cookies are passed through to the redirect response
      return response
    }

    // Redirect to login with the actual error message for debugging
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
