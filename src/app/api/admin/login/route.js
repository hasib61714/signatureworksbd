import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findUserByEmail, verifyPassword, countUsers, createUser, listUsers } from '@/lib/db/adminUsers'
import { createSession, COOKIE_NAME, COOKIE_OPTIONS, INFO_COOKIE_NAME, INFO_COOKIE_OPTIONS, makeInfoPayload } from '@/lib/auth'

export async function POST(request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  // Master bootstrap: ADMIN_PASSWORD env var gives super-admin access regardless of DB state
  const adminPassword = process.env.ADMIN_PASSWORD?.trim()
  if (adminPassword && password === adminPassword) {
    // Try to find by email first; fall back to any existing super_admin
    let user = await findUserByEmail(email)
    if (!user) {
      const total = await countUsers()
      if (total === 0) {
        user = await createUser({ email: email.toLowerCase(), name: 'Super Admin', password, role: 'super_admin' })
      } else {
        // Find the existing super admin
        const all = await listUsers()
        user = all.find(u => u.role === 'super_admin') || null
        if (!user) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
      }
    }
    const token = await createSession(user)
    const cookieStore = cookies()
    cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS)
    cookieStore.set(INFO_COOKIE_NAME, makeInfoPayload(user), INFO_COOKIE_OPTIONS)
    return NextResponse.json({ ok: true })
  }

  const user = await findUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
  }

  const valid = await verifyPassword(user, password)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
  }

  const token = await createSession(user)
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS)
  cookieStore.set(INFO_COOKIE_NAME, makeInfoPayload(user), INFO_COOKIE_OPTIONS)
  return NextResponse.json({ ok: true })
}
