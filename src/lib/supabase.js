import { createClient } from '@supabase/supabase-js'

function isRealValue(value) {
  if (!value) return false

  const normalized = value.trim()
  const blockedValues = [
    'PASTE_YOUR_SUPABASE_ANON_KEY_HERE',
    'your_supabase_anon_key_here',
    'CHANGE_THIS_TO_A_STRONG_PASSWORD',
    'your_strong_password_here',
  ]

  return Boolean(normalized) && !blockedValues.includes(normalized)
}

const supabaseUrl = isRealValue(process.env.NEXT_PUBLIC_SUPABASE_URL) ? process.env.NEXT_PUBLIC_SUPABASE_URL : null
const supabaseAnonKey = isRealValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : null

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Supabase] Missing valid NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Database features will stay in fallback mode.')
  }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
