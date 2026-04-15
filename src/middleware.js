import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('sw_admin_auth')?.value
    const password = process.env.ADMIN_PASSWORD?.trim()
    const hasRealPassword = password && !['CHANGE_THIS_TO_A_STRONG_PASSWORD', 'your_strong_password_here'].includes(password)

    if (!hasRealPassword || token !== password) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
