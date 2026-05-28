'use client'
import { useState, useEffect } from 'react'

const SECTION_LABELS = { contacts: 'Contacts', bookings: 'Bookings', portfolio: 'Portfolio', blog: 'Blog', settings: 'Full CMS', media: 'Media Library', users: 'User Management' }
const ALL_SECTIONS = Object.keys(SECTION_LABELS)

const EMPTY_FORM = { email: '', name: '', password: '', role: 'admin', permissions: { contacts: true, bookings: true, portfolio: false, blog: false, settings: false, media: false, users: false } }

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [resetPassword, setResetPassword] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    if (res.ok) setUsers(await res.json())
    setLoading(false)
  }

  function startEdit(user) {
    setEditing(user.id)
    setResetPassword('')
    setForm({ email: user.email, name: user.name, password: '', role: user.role, permissions: { ...EMPTY_FORM.permissions, ...(user.permissions || {}) } })
    setShowForm(true)
    setError('')
  }

  function startNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setResetPassword('')
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = { ...form }
    if (!payload.password) delete payload.password
    if (resetPassword) payload.password = resetPassword

    const res = editing
      ? await fetch(`/api/admin/users/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

    if (res.ok) {
      setSuccess(editing ? 'User updated.' : 'User created.')
      setShowForm(false)
      fetchUsers()
    } else {
      const d = await res.json()
      setError(d.error || 'Something went wrong.')
    }
    setSaving(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) { setSuccess('User deleted.'); fetchUsers() }
    else { const d = await res.json(); setError(d.error || 'Delete failed.') }
    setTimeout(() => setSuccess(''), 3000)
  }

  async function toggleActive(user) {
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !user.is_active }) })
    if (res.ok) fetchUsers()
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage who has access to the admin panel and what they can do.</p>
        </div>
        <button onClick={startNew} className="px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-colors">
          + New User
        </button>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">{success}</div>}

      {/* User list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No users yet. Create the first admin user.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Email', 'Role', 'Access', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'super_admin' ? 'bg-gold-100 text-gold-700' : 'bg-blue-50 text-blue-700'}`}>
                      {u.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role === 'super_admin' ? (
                      <span className="text-xs text-gray-500">All access</span>
                    ) : (
                      <span className="text-xs text-gray-500">
                        {ALL_SECTIONS.filter(s => u.permissions?.[s]).map(s => SECTION_LABELS[s]).join(', ') || 'None'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(u)} className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${u.is_active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(u)} className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(u.id, u.name)} className="text-xs text-rose-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">{editing ? 'Edit User' : 'New User'}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {editing ? 'New Password (leave blank to keep)' : 'Password *'}
                </label>
                <input type="password" value={editing ? resetPassword : form.password}
                  onChange={e => editing ? setResetPassword(e.target.value) : setForm(p => ({ ...p, password: e.target.value }))}
                  required={!editing} minLength={8}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400">
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>

            {form.role === 'admin' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Permissions</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALL_SECTIONS.map(s => (
                    <label key={s} className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" checked={!!form.permissions[s]}
                        onChange={e => setForm(p => ({ ...p, permissions: { ...p.permissions, [s]: e.target.checked } }))}
                        className="h-4 w-4 accent-gold-500" />
                      {SECTION_LABELS[s]}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 disabled:opacity-60 transition-colors">
                {saving ? 'Saving…' : editing ? 'Update User' : 'Create User'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
