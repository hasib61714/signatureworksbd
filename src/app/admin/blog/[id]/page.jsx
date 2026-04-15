'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function EditBlogPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('blog_posts').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) setForm({ ...data, tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '' })
        setLoading(false)
      })
  }, [id])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    const { error: err } = await supabase.from('blog_posts').update({
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (err) { setError(err.message); setSaving(false); return }
    router.push('/admin/blog')
  }

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors'
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'

  if (loading) return <div className="text-center py-20 text-gray-400">Loading…</div>
  if (!form) return <div className="text-center py-20 text-gray-400">Post not found</div>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        <Link href={`/blog/${form.slug}`} target="_blank" className="ml-auto text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          View live
        </Link>
      </div>

      {error && <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-3">Post Details</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><label className={labelCls}>Title *</label><input required value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Slug *</label><input required value={form.slug} onChange={e => set('slug', e.target.value)} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Excerpt</label><textarea rows={2} value={form.excerpt || ''} onChange={e => set('excerpt', e.target.value)} className={inputCls + ' resize-none'} /></div>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                <option>Design</option><option>Construction</option><option>Cost & Budgeting</option>
                <option>Materials</option><option>Interior</option><option>Tips</option>
              </select>
            </div>
            <div><label className={labelCls}>Published Date</label><input type="date" value={form.published_at || ''} onChange={e => set('published_at', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Read Time</label><input value={form.read_time || ''} onChange={e => set('read_time', e.target.value)} className={inputCls} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><label className={labelCls}>Author</label><input value={form.author || ''} onChange={e => set('author', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Tags (comma-separated)</label><input value={form.tags || ''} onChange={e => set('tags', e.target.value)} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Cover Image URL</label><input value={form.cover_image || ''} onChange={e => set('cover_image', e.target.value)} className={inputCls} /></div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className={labelCls + ' mb-3'}>Content (Markdown)</label>
          <textarea rows={20} value={form.content || ''} onChange={e => set('content', e.target.value)} className={inputCls + ' resize-y font-mono text-xs'} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="published" checked={!!form.published} onChange={e => set('published', e.target.checked)} className="w-4 h-4 accent-gold-500" />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">Published (uncheck to unpublish)</label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-semibold text-sm hover:bg-navy-800 transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-800">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
