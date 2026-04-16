'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import MediaUploadField from '@/shared/components/ui/MediaUploadField'

export default function EditPortfolioPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)
  const [highlights, setHighlights] = useState([''])
  const [gallery, setGallery] = useState([''])
  const [team, setTeam] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.from('portfolio_projects').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) {
          setForm(data)
          setHighlights(data.highlights?.length ? data.highlights : [''])
          setGallery(data.gallery?.length ? data.gallery : [''])
          setTeam(Array.isArray(data.team) ? data.team.join(', ') : data.team || '')
        }
        setLoading(false)
      })
  }, [id])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleTitleChange = e => {
    const val = e.target.value
    set('title', val)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    const { error: err } = await supabase.from('portfolio_projects').update({
      ...form,
      highlights: highlights.filter(Boolean),
      gallery: gallery.filter(Boolean),
      team: team ? team.split(',').map(item => item.trim()).filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (err) { setError(err.message); setSaving(false); return }
    router.push('/admin/portfolio')
  }

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors'
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'

  if (loading) return <div className="text-center py-20 text-gray-400">Loading…</div>
  if (!form) return <div className="text-center py-20 text-gray-400">Project not found</div>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/portfolio" className="text-gray-400 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <Link href={`/portfolio/${form.slug}`} target="_blank" className="ml-auto text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          View live
        </Link>
      </div>

      {error && <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-3">Basic Info</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Title *</label>
              <input required value={form.title} onChange={handleTitleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug *</label>
              <input required value={form.slug} onChange={e => set('slug', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <input value={form.subtitle || ''} onChange={e => set('subtitle', e.target.value)} className={inputCls} />
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                <option>Construction</option><option>Architecture</option><option>Interior Design</option><option>Renovation</option>
              </select>
            </div>
            <div><label className={labelCls}>Location</label><input value={form.location || ''} onChange={e => set('location', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Year</label><input value={form.year || ''} onChange={e => set('year', e.target.value)} className={inputCls} /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <div><label className={labelCls}>Client</label><input value={form.client || ''} onChange={e => set('client', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Area</label><input value={form.area || ''} onChange={e => set('area', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Duration</label><input value={form.duration || ''} onChange={e => set('duration', e.target.value)} className={inputCls} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><label className={labelCls}>Budget</label><input value={form.budget || ''} onChange={e => set('budget', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Team Members</label><input value={team} onChange={e => setTeam(e.target.value)} className={inputCls} placeholder="Architect, Site Engineer, Interior Designer" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-3">Images</h2>
          <div>
            <label className={labelCls}>Cover Image</label>
            <MediaUploadField
              label="Cover Image"
              value={form.image || ''}
              onChange={(nextValue) => set('image', nextValue)}
              placeholder="Paste image URL or upload"
              className={inputCls}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Before Image</label>
              <MediaUploadField
                label="Before Image"
                value={form.before_image || ''}
                onChange={(nextValue) => set('before_image', nextValue)}
                placeholder="Paste image URL or upload"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>After Image</label>
              <MediaUploadField
                label="After Image"
                value={form.after_image || ''}
                onChange={(nextValue) => set('after_image', nextValue)}
                placeholder="Paste image URL or upload"
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Video</label>
            <MediaUploadField
              label="Video URL"
              value={form.video_url || ''}
              onChange={(nextValue) => set('video_url', nextValue)}
              placeholder="Paste video URL or upload"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Gallery Images</label>
            {gallery.map((url, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={url} onChange={e => { const g = [...gallery]; g[i] = e.target.value; setGallery(g) }} className={inputCls} placeholder="https://..." />
                <button type="button" onClick={() => setGallery(g => g.filter((_, j) => j !== i))} className="text-gold-500 hover:text-gold-700 px-2" aria-label="Remove image"><X className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => setGallery(g => [...g, ''])} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Image</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-3">Description</h2>
          <div><label className={labelCls}>Short Description</label><textarea rows={2} value={form.description || ''} onChange={e => set('description', e.target.value)} className={inputCls + ' resize-none'} /></div>
          <div><label className={labelCls}>Full Description</label><textarea rows={5} value={form.full_description || ''} onChange={e => set('full_description', e.target.value)} className={inputCls + ' resize-none'} /></div>
          <div>
            <label className={labelCls}>Highlights</label>
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={h} onChange={e => { const hs = [...highlights]; hs[i] = e.target.value; setHighlights(hs) }} className={inputCls} />
                <button type="button" onClick={() => setHighlights(hs => hs.filter((_, j) => j !== i))} className="text-gold-500 hover:text-gold-700 px-2" aria-label="Remove highlight"><X className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => setHighlights(h => [...h, ''])} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Highlight</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-semibold text-sm hover:bg-navy-800 transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/admin/portfolio" className="text-sm text-gray-500 hover:text-gray-800">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
