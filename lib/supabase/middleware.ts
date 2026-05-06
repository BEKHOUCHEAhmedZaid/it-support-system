import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Inject the current pathname for server components to consume
  const headers = new Headers(request.headers)
  headers.set('x-pathname', request.nextUrl.pathname)
  let supabaseResponse = NextResponse.next({
    request: {
      headers: headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return supabaseResponse

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    // Allow static assets and public files
    if (path.includes('.') || path.startsWith('/_next')) return supabaseResponse

    if (!user) {
      if (path.startsWith('/admin') || path.startsWith('/technician') || path.startsWith('/client')) {
        if (path.endsWith('/login')) return supabaseResponse
        return NextResponse.redirect(new URL('/', request.url))
      }
      return supabaseResponse
    }

    const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
    
    // IF NO PROFILE: Critical fallback to avoid loops
    if (!profile) {
      if (path === '/' || path.endsWith('/login')) return supabaseResponse
      // For any authenticated path without a profile, sign out and go home
      await supabase.auth.signOut()
      const response = NextResponse.redirect(new URL('/', request.url))
      // Copy cookies from supabaseResponse (where signOut might have cleared them)
      supabaseResponse.cookies.getAll().forEach(c => response.cookies.set(c.name, c.value))
      return response
    }

    const role = profile.role
    const status = profile.status

    // If logged in and at root or login page, redirect to respective entry point
    if (path === '/' || path.endsWith('/login')) {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin/tickets', request.url))
      if (role === 'technician') {
        if (status !== 'approved') {
          await supabase.auth.signOut()
          return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.redirect(new URL('/technician/tickets', request.url))
      }
      // Both 'client' and legacy 'employee' go to client space
      return NextResponse.redirect(new URL('/client/tickets', request.url))
    }

    // Role-based path protection (STRICT)
    if (path.startsWith('/admin')) {
      if (role !== 'admin') {
        const dest = role === 'technician' ? '/technician/tickets' : '/client/tickets'
        return NextResponse.redirect(new URL(dest, request.url))
      }
    }

    if (path.startsWith('/technician')) {
      if (role !== 'technician' && role !== 'admin') {
        return NextResponse.redirect(new URL('/client/tickets', request.url))
      }
      if (role === 'technician' && status !== 'approved') {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    if (path.startsWith('/client')) {
      if (role !== 'client' && role !== 'employee' && role !== 'admin') {
        return NextResponse.redirect(new URL('/technician/tickets', request.url))
      }
    }

    return supabaseResponse
  } catch (error) {
    return supabaseResponse
  }
}
