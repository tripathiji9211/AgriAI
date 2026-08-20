import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  // Handle forwarded headers for Vercel/reverse proxy deployments
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  
  let origin = requestUrl.origin
  if (forwardedHost) {
    const proto = forwardedProto || 'https'
    origin = `${proto}://${forwardedHost}`
  }

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      console.error("Auth Callback Error:", error.message)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    } catch (err: any) {
      console.error("Auth Callback Exception:", err)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
