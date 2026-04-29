'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'Login failed.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-white font-bold text-sm leading-none">Signature Works</p>
              <p className="text-slate-400 text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8">
          <h1 className="text-white font-bold text-xl mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-6">Enter your admin password to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white rounded-xl placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-colors text-sm"
              />
            </div>

            {error && (
              <p className="text-amber-300 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-900 via-navy-700 to-gold-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Set <code className="text-slate-400">ADMIN_PASSWORD</code> in your .env.local file
        </p>
      </div>
    </div>
  )
}
