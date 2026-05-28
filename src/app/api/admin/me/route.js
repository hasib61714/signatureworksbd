import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseSession, COOKIE_NAME, INFO_COOKIE_NAME, INFO_COOKIE_OPTIONS, makeInfoPayload } from '@/lib/auth'

export async function GET() {
  const cookieStore = cookies()
  const session = await parseSession(cookieStore.get(COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const info = { name: session.name, role: session.role, permissions: session.permissions }

  const res = NextResponse.json(info)
  // Refresh the info cookie so existing sessions get it without re-login
  res.cookies.set(INFO_COOKIE_NAME, makeInfoPayload(session), INFO_COOKIE_OPTIONS)
  return res
}
