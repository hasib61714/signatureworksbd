'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CARDS = [
  { label: 'Total Contacts', table: 'contact_submissions', href: '/admin/contacts', color: 'text-blue-600', bg: 'bg-blue-50', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
  )},
  { label: 'Total Bookings', table: 'bookings', href: '/admin/bookings', color: 'text-purple-600', bg: 'bg-purple-50', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
  )},
  { label: 'Portfolio Projects', table: 'portfolio_projects', href: '/admin/portfolio', color: 'text-gold-700', bg: 'bg-gold-50', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
  )},
  { label: 'Blog Posts', table: 'blog_posts', href: '/admin/blog', color: 'text-green-600', bg: 'bg-green-50', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
  )},
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState({})
  const [recentContacts, setRecentContacts] = useState([])
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    if (!supabase) return
    Promise.all(
      CARDS.map(c =>
        supabase.from(c.table).select('*', { count: 'exact', head: true })
          .then(({ count }) => ({ [c.table]: count ?? 0 }))
      )
    ).then(results => setCounts(Object.assign({}, ...results)))

    supabase.from('contact_submissions').select('*').order('submitted_at', { ascending: false }).limit(5)
      .then(({ data }) => setRecentContacts(data || []))

    supabase.from('bookings').select('*').order('submitted_at', { ascending: false }).limit(5)
      .then(({ data }) => setRecentBookings(data || []))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your website content and inquiries</p>
      </div>

      {!supabase && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Supabase not configured.</strong> Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your .env.local file to enable all features.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {CARDS.map(c => (
          <Link key={c.table} href={c.href} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
                {c.icon}
              </div>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <p className="text-3xl font-black text-gray-900">{counts[c.table] ?? '—'}</p>
            <p className="text-gray-500 text-sm mt-0.5">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent contacts */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Contacts</h2>
            <Link href="/admin/contacts" className="text-xs text-gold-700 hover:underline font-medium">View all</Link>
          </div>
          {recentContacts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No contacts yet</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentContacts.map(c => (
                <li key={c.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.phone} · {c.service || 'No service'}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(c.submitted_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-gold-700 hover:underline font-medium">View all</Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No bookings yet</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentBookings.map(b => (
                <li key={b.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.date} {b.time && `· ${b.time}`}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    b.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                    b.status === 'cancelled' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {b.status || 'pending'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
