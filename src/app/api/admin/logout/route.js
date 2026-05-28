import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, INFO_COOKIE_NAME } from '@/lib/auth'

export async function POST() {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  cookieStore.set(INFO_COOKIE_NAME, '', { maxAge: 0, path: '/' })
  cookieStore.set('sw_admin_auth', '', { maxAge: 0, path: '/' })
  return NextResponse.json({ ok: true })
}
