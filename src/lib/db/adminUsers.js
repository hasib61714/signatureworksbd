import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function findUserByEmail(email) {
  const sb = getServiceClient()
  if (!sb) return null
  const { data } = await sb.from('admin_users').select('*').eq('email', email.toLowerCase()).eq('is_active', true).single()
  return data || null
}

export async function findUserById(id) {
  const sb = getServiceClient()
  if (!sb) return null
  const { data } = await sb.from('admin_users').select('*').eq('id', id).single()
  return data || null
}

export async function listUsers() {
  const sb = getServiceClient()
  if (!sb) return []
  const { data } = await sb.from('admin_users').select('id,email,name,role,permissions,is_active,created_at').order('created_at', { ascending: true })
  return data || []
}

export async function createUser({ email, name, password, role = 'admin', permissions }) {
  const sb = getServiceClient()
  if (!sb) throw new Error('Service client not available')
  const password_hash = await bcrypt.hash(password, 10)
  const defaultPerms = { contacts: true, bookings: true, portfolio: false, blog: false, settings: false, media: false, users: false }
  const { data, error } = await sb.from('admin_users').insert([{
    email: email.toLowerCase(), name, password_hash, role,
    permissions: permissions || defaultPerms,
  }]).select('id,email,name,role,permissions,is_active').single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateUser(id, updates) {
  const sb = getServiceClient()
  if (!sb) throw new Error('Service client not available')
  const payload = { updated_at: new Date().toISOString() }
  if (updates.name) payload.name = updates.name
  if (updates.email) payload.email = updates.email.toLowerCase()
  if (updates.role) payload.role = updates.role
  if (updates.permissions !== undefined) payload.permissions = updates.permissions
  if (updates.is_active !== undefined) payload.is_active = updates.is_active
  if (updates.password) payload.password_hash = await bcrypt.hash(updates.password, 10)
  const { data, error } = await sb.from('admin_users').update(payload).eq('id', id).select('id,email,name,role,permissions,is_active').single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteUser(id) {
  const sb = getServiceClient()
  if (!sb) throw new Error('Service client not available')
  const { error } = await sb.from('admin_users').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password_hash)
}

export async function countUsers() {
  const sb = getServiceClient()
  if (!sb) return 0
  const { count } = await sb.from('admin_users').select('*', { count: 'exact', head: true })
  return count || 0
}

export async function createResetToken(email) {
  const sb = getServiceClient()
  if (!sb) throw new Error('Service client not available')
  const token = randomBytes(4).toString('hex').toUpperCase()
  await sb.from('admin_password_resets').delete().eq('email', email.toLowerCase())
  const { error } = await sb.from('admin_password_resets').insert([{
    email: email.toLowerCase(),
    token,
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  }])
  if (error) throw new Error(error.message)
  return token
}

export async function verifyResetToken(email, token) {
  const sb = getServiceClient()
  if (!sb) return false
  const { data } = await sb.from('admin_password_resets')
    .select('*').eq('email', email.toLowerCase()).eq('token', token).eq('used', false)
    .gte('expires_at', new Date().toISOString()).single()
  return data || null
}

export async function markResetTokenUsed(id) {
  const sb = getServiceClient()
  if (!sb) return
  await sb.from('admin_password_resets').update({ used: true }).eq('id', id)
}
