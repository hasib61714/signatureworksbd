import { NextResponse } from 'next/server'
import { findUserByEmail, verifyResetToken, updateUser, markResetTokenUsed } from '@/lib/db/adminUsers'

export async function POST(request) {
  const { email, token, newPassword } = await request.json()
  if (!email || !token || !newPassword) {
    return NextResponse.json({ error: 'Email, token, and new password are required.' }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const resetRecord = await verifyResetToken(email, token)
  if (!resetRecord) {
    return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 })
  }

  const user = await findUserByEmail(email)
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

  await updateUser(user.id, { password: newPassword })
  await markResetTokenUsed(resetRecord.id)

  return NextResponse.json({ ok: true })
}
