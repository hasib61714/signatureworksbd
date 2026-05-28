import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseSession, COOKIE_NAME } from '@/lib/auth'
import { findUserById, verifyPassword, updateUser } from '@/lib/db/adminUsers'

export async function POST(request) {
  const cookieStore = cookies()
  const session = await parseSession(cookieStore.get(COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currentPassword, newPassword } = await request.json()
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both current and new password are required.' }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
  }

  const user = await findUserById(session.id)
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

  const valid = await verifyPassword(user, currentPassword)
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 })

  await updateUser(session.id, { password: newPassword })
  return NextResponse.json({ ok: true })
}
