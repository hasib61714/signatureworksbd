'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { portfolioData } from '@/features/portfolio/data/portfolioData'

export default function AdminPortfolioPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('supabase') // 'supabase' | 'static'

  const load = async () => {
    setLoading(true)
    if (supabase) {
      const { data } = await supabase.from('portfolio_projects').select('*').order('order_index', { ascending: true })
      if (data && data.length > 0) { setRows(data); setSource('supabase') }
      else { setRows(portfolioData); setSource('static') }
    } else {
      setRows(portfolioData)
      setSource('static')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async row => {
    if (!confirm(`Delete "${row.title}"?`)) return
    if (source === 'supabase') {
      await supabase.from('portfolio_projects').delete().eq('id', row.id)
      setRows(r => r.filter(x => x.id !== row.id))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-500 text-sm mt-1">
            {rows.length} projects
            {source === 'static' && <span className="ml-2 text-amber-600 text-xs">(showing static data — add to Supabase to manage)</span>}
          </p>
        </div>
        <Link href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Project
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map(row => (
              <div key={row.id || row.slug} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                {row.image && (
                  <Image
                    src={row.image}
                    alt={row.title}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{row.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{row.category} · {row.location} · {row.year}</p>
                  <p className="text-gray-400 text-xs font-mono">/portfolio/{row.slug}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/portfolio/${row.slug}`} target="_blank" className="text-xs text-gray-400 hover:text-gray-700">View</Link>
                  {source === 'supabase' ? (
                    <Link href={`/admin/portfolio/${row.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
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
