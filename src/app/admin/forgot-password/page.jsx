'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [result, setResult] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    const res = await fetch('/api/admin/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setResult(data)
    setStatus('done')
  }

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
          <h1 className="text-white font-bold text-xl mb-1">Forgot Password</h1>
          <p className="text-slate-400 text-sm mb-6">Enter your admin email to get a reset token.</p>

          {status === 'done' ? (
            <div className="space-y-5">
              {result?.sent ? (
                <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 text-sm text-green-300">
                  Reset token sent to your email. Use it within 1 hour.
                </div>
              ) : result?.token ? (
                <div className="space-y-3">
                  <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
                    Email not configured. Your reset token is shown below — copy it and use it on the reset page.
                  </div>
                  <div className="bg-slate-800 border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-slate-400 text-xs mb-1 uppercase tracking-widest">Reset Token</p>
                    <p className="text-white font-mono text-2xl font-bold tracking-widest">{result.token}</p>
                    <p className="text-slate-500 text-xs mt-1">Valid for 1 hour</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800 border border-white/10 rounded-xl p-4 text-sm text-slate-300">
                  If that email belongs to an admin account, a reset token has been generated.
                </div>
              )}
              <Link href="/admin/reset-password" className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-navy-900 via-navy-700 to-gold-500 text-white font-semibold text-sm hover:shadow-lg transition-all">
                Go to Reset Password
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white rounded-xl placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-colors text-sm" />
              </div>
              <button type="submit" disabled={status === 'sending'} className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-900 via-navy-700 to-gold-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all disabled:opacity-60">
                {status === 'sending' ? 'Sending…' : 'Get Reset Token'}
              </button>
              <Link href="/admin/login" className="block text-center text-slate-500 text-xs hover:text-slate-300 transition-colors mt-2">
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
