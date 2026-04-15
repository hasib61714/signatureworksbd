import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD?.trim()
  const hasRealPassword = adminPassword && !['CHANGE_THIS_TO_A_STRONG_PASSWORD', 'your_strong_password_here'].includes(adminPassword)

  if (!hasRealPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD not configured.' }, { status: 500 })
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
  }

  const cookieStore = cookies()
  cookieStore.set('sw_admin_auth', adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
