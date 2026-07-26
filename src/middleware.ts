import { NextRequest, NextResponse } from 'next/server'

// Paths that require authentication
const PROTECTED_STUDENT = ['/dashboard', '/subjects', '/profile', '/leaderboard', '/ai-tutor', '/projects', '/certificates', '/onboarding']
const PROTECTED_ADMIN   = ['/admin']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtectedStudent = PROTECTED_STUDENT.some(p => pathname.startsWith(p))
  const isProtectedAdmin   = PROTECTED_ADMIN.some(p => pathname.startsWith(p))

  if (!isProtectedStudent && !isProtectedAdmin) {
    return NextResponse.next()
  }

  // Check for Firebase session token in cookie
  // (The client stores the ID token in a cookie after signing in)
  const sessionCookie = req.cookies.get('__session')?.value

  if (!sessionCookie) {
    const loginUrl = isProtectedAdmin
      ? new URL('/login/admin', req.url)
      : new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Note: Full token verification happens in the API routes / Server Components
  // Middleware does a lightweight cookie presence check only for fast redirects.
  // Firebase Admin SDK cannot run in Edge middleware, so we use a simple check here.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
