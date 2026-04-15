'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ContactsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [draft, setDraft] = useState({})
  const [error, setError] = useState('')

  const load = async () => {
    if (!supabase) {
      setRows([])
      setLoading(false)
      return
    }

    setLoading(true)
    const { data } = await supabase.from('contact_submissions').select('*').order('submitted_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { if (supabase) { load() } else { setLoading(false) } }, [])

  const startEdit = (row) => {
    setEditingId(row.id)
    setDraft({
      name: row.name || '',
      phone: row.phone || '',
      email: row.email || '',
      service: row.service || '',
      budget: row.budget || '',
      message: row.message || '',
    })
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft({})
    setError('')
  }

  const handleSave = async (id) => {
    if (!supabase) return
    setSavingId(id)
    setError('')

    const payload = {
      name: draft.name?.trim() || '',
      phone: draft.phone?.trim() || '',
      email: draft.email?.trim() || null,
      service: draft.service?.trim() || null,
      budget: draft.budget?.trim() || null,
      message: draft.message?.trim() || null,
    }

    const { error: updateError } = await supabase.from('contact_submissions').update(payload).eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setSavingId(null)
      return
    }

    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...payload } : row)))
    setSavingId(null)
    cancelEdit()
  }

  const handleDelete = async id => {
    if (!supabase || !confirm('Delete this submission?')) return
    setDeleting(id)
    await supabase.from('contact_submissions').delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
    if (editingId === id) cancelEdit()
    setDeleting(null)
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 focus:border-gold-400 focus:outline-none'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-500 text-sm mt-1">{rows.length} total submissions</p>
        </div>
        <button onClick={load} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          Refresh
        </button>
      </div>

      {!supabase && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">Supabase not configured.</div>}
      {error && <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No submissions yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Phone', 'Email', 'Service', 'Budget', 'Message', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(row => {
                  const editing = editingId === row.id
                  return (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors align-top">
                      <td className="px-4 py-3 font-medium text-gray-900 min-w-[150px]">
                        {editing ? <input value={draft.name || ''} onChange={e => setDraft(v => ({ ...v, name: e.target.value }))} className={inputCls} /> : row.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 min-w-[130px]">
                        {editing ? <input value={draft.phone || ''} onChange={e => setDraft(v => ({ ...v, phone: e.target.value }))} className={inputCls} /> : row.phone}
                      </td>
                      <td className="px-4 py-3 text-gray-600 min-w-[180px]">
                        {editing ? <input value={draft.email || ''} onChange={e => setDraft(v => ({ ...v, email: e.target.value }))} className={inputCls} /> : (row.email || '—')}
                      </td>
                      <td className="px-4 py-3 text-gray-600 min-w-[140px]">
                        {editing ? <input value={draft.service || ''} onChange={e => setDraft(v => ({ ...v, service: e.target.value }))} className={inputCls} /> : (row.service || '—')}
                      </td>
                      <td className="px-4 py-3 text-gray-600 min-w-[120px]">
                        {editing ? <input value={draft.budget || ''} onChange={e => setDraft(v => ({ ...v, budget: e.target.value }))} className={inputCls} /> : (row.budget || '—')}
                      </td>
                      <td className="px-4 py-3 text-gray-600 min-w-[240px]">
                        {editing ? <textarea rows={3} value={draft.message || ''} onChange={e => setDraft(v => ({ ...v, message: e.target.value }))} className={inputCls + ' resize-y'} /> : <p className="max-w-xs whitespace-pre-wrap">{row.message || '—'}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{new Date(row.submitted_at).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {editing ? (
                            <>
                              <button onClick={() => handleSave(row.id)} disabled={savingId === row.id} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-40">
                                {savingId === row.id ? 'Saving...' : 'Save'}
                              </button>
                              <button onClick={cancelEdit} className="text-xs font-medium text-slate-500 hover:text-slate-700">Cancel</button>
                            </>
                          ) : (
                            <button onClick={() => startEdit(row)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Edit</button>
                          )}
                          <button
                            onClick={() => handleDelete(row.id)}
                            disabled={deleting === row.id}
                            className="text-gold-600 hover:text-gold-700 text-xs font-medium disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
