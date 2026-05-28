import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseSession, COOKIE_NAME } from '@/lib/auth'
import { listUsers, createUser } from '@/lib/db/adminUsers'

export async function GET() {
  const cookieStore = cookies()
  const session = await parseSession(cookieStore.get(COOKIE_NAME)?.value)
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const users = await listUsers()
  return NextResponse.json(users)
}

export async function POST(request) {
  const cookieStore = cookies()
  const session = await parseSession(cookieStore.get(COOKIE_NAME)?.value)
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await request.json()
  const { email, name, password, role, permissions } = body
  if (!email || !name || !password) {
    return NextResponse.json({ error: 'email, name, and password are required.' }, { status: 400 })
  }
  try {
    const user = await createUser({ email, name, password, role, permissions })
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
