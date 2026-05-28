'use client'
import { useState } from 'react'

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    setStatus('saving')
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    })
    if (res.ok) {
      setStatus('done')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to change password.')
      setStatus(null)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors'
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <p className="text-gray-500 text-sm mt-1">Update your admin login password.</p>
      </div>

      {status === 'done' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 font-medium">
          Password changed successfully.
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className={labelCls}>Current Password</label>
          <input type="password" value={form.currentPassword} onChange={e => setForm(p => ({ ...p, currentPassword: e.target.value }))} required className={inputCls} placeholder="••••••••" />
        </div>
        <div>
          <label className={labelCls}>New Password</label>
          <input type="password" value={form.newPassword} onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={8} className={inputCls} placeholder="Minimum 8 characters" />
        </div>
        <div>
          <label className={labelCls}>Confirm New Password</label>
          <input type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} required className={inputCls} placeholder="Repeat new password" />
        </div>
        <button type="submit" disabled={status === 'saving'} className="w-full py-2.5 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 disabled:opacity-60 transition-colors">
          {status === 'saving' ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
