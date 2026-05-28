import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseSession, COOKIE_NAME } from '@/lib/auth'
import { updateUser, deleteUser } from '@/lib/db/adminUsers'

async function getSession() {
  const cookieStore = cookies()
  return await parseSession(cookieStore.get(COOKIE_NAME)?.value)
}

export async function PUT(request, { params }) {
  const session = await getSession()
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await request.json()
  try {
    const user = await updateUser(params.id, body)
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  const session = await getSession()
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (params.id === session.id) {
    return NextResponse.json({ error: 'Cannot delete your own account.' }, { status: 400 })
  }
  try {
    await deleteUser(params.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
