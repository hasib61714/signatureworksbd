const enc = new TextEncoder()
const dec = new TextDecoder()

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function b64urlDecode(str) {
  const pad = str.length % 4
  const padded = pad ? str + '='.repeat(4 - pad) : str
  return Uint8Array.from(atob(padded.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
}

async function getKey() {
  const secret = process.env.ADMIN_SECRET || 'fallback_secret_change_this'
  const keyData = enc.encode(secret)
  return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

export const COOKIE_NAME = 'sw_admin_session'
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
}

// Non-httpOnly cookie for client-side UI (name, role, permissions only — no auth token)
export const INFO_COOKIE_NAME = 'sw_admin_info'
export const INFO_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
}

export function makeInfoPayload(user) {
  const permissions = user.role === 'super_admin'
    ? { contacts: true, bookings: true, portfolio: true, blog: true, settings: true, media: true, users: true }
    : (user.permissions || {})
  return encodeURIComponent(JSON.stringify({ name: user.name, role: user.role, permissions }))
}

export async function createSession(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.role === 'super_admin'
      ? { contacts: true, bookings: true, portfolio: true, blog: true, settings: true, media: true, users: true }
      : (user.permissions || {}),
  }
  const data = b64url(enc.encode(JSON.stringify(payload)))
  const key = await getKey()
  const sig = b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
  return `${data}.${sig}`
}

export async function parseSession(token) {
  if (!token) return null
  const dot = token.lastIndexOf('.')
  if (dot < 1) return null
  const data = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  try {
    const key = await getKey()
    const valid = await crypto.subtle.verify('HMAC', key, b64urlDecode(sig), enc.encode(data))
    if (!valid) return null
    return JSON.parse(dec.decode(b64urlDecode(data)))
  } catch {
    return null
  }
}

export function canAccess(session, section) {
  if (!session) return false
  if (session.role === 'super_admin') return true
  return session.permissions?.[section] === true
}
