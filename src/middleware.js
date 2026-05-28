import { NextResponse } from 'next/server'
import { parseSession, COOKIE_NAME } from '@/lib/auth'

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']

const SECTION_PATHS = {
  contacts: ['/admin/contacts'],
  bookings: ['/admin/bookings'],
  portfolio: ['/admin/portfolio'],
  blog: ['/admin/blog'],
  settings: ['/admin/settings'],
  media: ['/admin/media'],
  users: ['/admin/users'],
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  // Fallback: support old single-password cookie during transition
  const legacyCookie = request.cookies.get('sw_admin_auth')?.value

  const session = await parseSession(token)

  if (!session) {
    // Allow legacy cookie as fallback if service role key not yet configured
    const adminPassword = process.env.ADMIN_PASSWORD?.trim()
    if (legacyCookie && adminPassword && legacyCookie === adminPassword) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Dashboard, change-password always accessible when logged in
  if (pathname === '/admin' || pathname === '/admin/change-password') return NextResponse.next()

  // Super admin has full access
  if (session.role === 'super_admin') return NextResponse.next()

  // Check section permissions for regular admins
  for (const [section, paths] of Object.entries(SECTION_PATHS)) {
    if (paths.some(p => pathname.startsWith(p))) {
      if (!session.permissions?.[section]) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
