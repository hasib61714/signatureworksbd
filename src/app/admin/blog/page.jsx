'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { blogData } from '@/data/blogData'

export default function AdminBlogPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('supabase')

  const load = async () => {
    setLoading(true)
    if (supabase) {
      const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false })
      if (data && data.length > 0) { setRows(data); setSource('supabase') }
      else { setRows(blogData); setSource('static') }
    } else {
      setRows(blogData); setSource('static')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async row => {
    if (!confirm(`Delete "${row.title}"?`)) return
    if (source === 'supabase') {
      await supabase.from('blog_posts').delete().eq('id', row.id)
      setRows(r => r.filter(x => x.id !== row.id))
    }
  }

  const togglePublished = async row => {
    if (source !== 'supabase') return
    const val = !row.published
    await supabase.from('blog_posts').update({ published: val }).eq('id', row.id)
    setRows(r => r.map(x => x.id === row.id ? { ...x, published: val } : x))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">
            {rows.length} posts
            {source === 'static' && <span className="ml-2 text-amber-600 text-xs">(showing static data)</span>}
          </p>
        </div>
        <Link href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map(row => (
              <div key={row.id || row.slug} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                {row.coverImage || row.cover_image ? (
                  <Image
                    src={row.coverImage || row.cover_image}
                    alt={row.title}
                    width={64}
                    height={48}
                    className="h-12 w-16 rounded-lg object-cover shrink-0"
                  />
                ) : null}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm truncate">{row.title}</p>
                    {source === 'supabase' && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${row.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {row.published ? 'Published' : 'Draft'}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{row.category} · {row.publishedAt || row.published_at} · {row.readTime || row.read_time}</p>
                  <p className="text-gray-400 text-xs font-mono">/blog/{row.slug}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/blog/${row.slug}`} target="_blank" className="text-xs text-gray-400 hover:text-gray-700">View</Link>
                  {source === 'supabase' && (
                    <button onClick={() => togglePublished(row)} className={`text-xs font-medium ${row.published ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'}`}>
                      {row.published ? 'Unpublish' : 'Publish'}
                    </button>
                  )}
                  {source === 'supabase' ? (
                    <Link href={`/admin/blog/${row.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                  ) : (
                    <span className="text-xs text-gray-300">Edit</span>
                  )}
                  <button onClick={() => handleDelete(row)} disabled={source === 'static'} className="text-xs text-gold-600 hover:text-gold-700 font-medium disabled:opacity-30">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
