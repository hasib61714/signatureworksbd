'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'Login failed.')
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-4 py-3 bg-slate-800 border border-white/10 text-white rounded-xl placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-colors text-sm'
  const labelCls = 'block text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2'

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div>
            <p className="text-white font-bold text-sm leading-none text-center">Signature Works</p>
            <p className="text-slate-400 text-xs mt-0.5 text-center">Admin Panel</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8">
          <h1 className="text-white font-bold text-xl mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to your admin account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                required
                className={inputCls}
              />
            </div>

            {error && <p className="text-amber-300 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-900 via-navy-700 to-gold-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link href="/admin/forgot-password" className="text-slate-500 text-xs hover:text-gold-300 transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
