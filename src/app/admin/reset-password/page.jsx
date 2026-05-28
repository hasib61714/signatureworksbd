'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', token: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setStatus('saving')
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, token: form.token.toUpperCase(), newPassword: form.newPassword }),
    })
    if (res.ok) {
      setStatus('done')
      setTimeout(() => router.push('/admin/login'), 2000)
    } else {
      const d = await res.json()
      setError(d.error || 'Reset failed.')
      setStatus(null)
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
          <h1 className="text-white font-bold text-xl mb-1">Reset Password</h1>
          <p className="text-slate-400 text-sm mb-6">Enter your email, reset token, and new password.</p>

          {status === 'done' ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-semibold">Password Reset!</p>
              <p className="text-slate-400 text-sm">Redirecting to login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-amber-300 text-sm">{error}</p>}
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="your@email.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Reset Token</label>
                <input value={form.token} onChange={e => setForm(p => ({ ...p, token: e.target.value }))} required placeholder="XXXXXXXX" className={`${inputCls} font-mono tracking-widest`} />
              </div>
              <div>
                <label className={labelCls}>New Password</label>
                <input type="password" value={form.newPassword} onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={8} placeholder="Minimum 8 characters" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} required placeholder="Repeat new password" className={inputCls} />
              </div>
              <button type="submit" disabled={status === 'saving'} className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-900 via-navy-700 to-gold-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all disabled:opacity-60">
                {status === 'saving' ? 'Resetting…' : 'Reset Password'}
              </button>
              <Link href="/admin/login" className="block text-center text-slate-500 text-xs hover:text-slate-300 transition-colors mt-2">Back to Login</Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
