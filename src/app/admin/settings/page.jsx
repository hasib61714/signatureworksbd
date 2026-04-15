'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PHONE_NUMBER, WHATSAPP_NUMBER, EMAIL, FACEBOOK_URL, WEBSITE_URL } from '@/shared/constants/constants'
import { heroSlidesData } from '@/features/home/data/heroData'
import { servicesData } from '@/features/home/data/servicesData'
import { testimonialsData } from '@/features/home/data/testimonialsData'
import { statsData } from '@/features/home/data/statsData'
import { processData } from '@/features/home/data/processData'
import { whyUsData } from '@/features/home/data/whyUsData'
import { aboutData } from '@/features/home/data/aboutData'

const SETTINGS_KEYS = [
  { key: 'phone_number', label: 'Phone Number', placeholder: PHONE_NUMBER, hint: 'Shown in header, footer, and contact section' },
  { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: WHATSAPP_NUMBER, hint: 'Without +, e.g. 8801712345678' },
  { key: 'email', label: 'Email Address', placeholder: EMAIL, hint: 'Shown in footer and contact section' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: FACEBOOK_URL, hint: 'Full URL including https://' },
  { key: 'website_url', label: 'Website URL', placeholder: WEBSITE_URL, hint: 'Your public domain' },
]

const CONTENT_KEYS = [
  {
    key: 'hero_slides_json',
    label: 'Homepage Hero Slides',
    hint: 'You can edit text, links, and images here. Keep this as a valid JSON array.',
    defaultValue: JSON.stringify(heroSlidesData, null, 2),
  },
  {
    key: 'services_home_json',
    label: 'Homepage Services',
    hint: 'Edit, add, or remove homepage service cards from here.',
    defaultValue: JSON.stringify(servicesData, null, 2),
  },
  {
    key: 'testimonials_json',
    label: 'Homepage Testimonials',
    hint: 'Manage client testimonials shown on the homepage.',
    defaultValue: JSON.stringify(testimonialsData, null, 2),
  },
  {
    key: 'stats_json',
    label: 'Homepage Stats',
    hint: 'Manage the stats strip shown on the homepage.',
    defaultValue: JSON.stringify(statsData, null, 2),
  },
  {
    key: 'process_json',
    label: 'Homepage Process Steps',
    hint: 'Manage the 4-step process section content.',
    defaultValue: JSON.stringify(processData, null, 2),
  },
  {
    key: 'why_us_json',
    label: 'Homepage Why Choose Us',
    hint: 'Manage the benefit cards shown on the homepage.',
    defaultValue: JSON.stringify(whyUsData, null, 2),
  },
  {
    key: 'about_home_json',
    label: 'Homepage About Section',
    hint: 'Manage the story, mission, values, and team info for the homepage.',
    defaultValue: JSON.stringify(aboutData, null, 2),
  },
]

export default function SettingsPage() {
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const defaults = Object.fromEntries(CONTENT_KEYS.map((item) => [item.key, item.defaultValue]))

    if (!supabase) {
      setValues(defaults)
      return
    }

    supabase.from('site_settings').select('*')
      .then(({ data }) => {
        const map = { ...defaults }
        data?.forEach(row => { map[row.key] = row.value })
        setValues(map)
      })
  }, [])

  const handleSave = async e => {
    e.preventDefault()
    if (!supabase) return

    setSaving(true)
    setSaved(false)
    setError('')

    try {
      CONTENT_KEYS.forEach((item) => {
        const raw = values[item.key] || item.defaultValue
        JSON.parse(raw)
      })
    } catch {
      setError('One of the JSON content fields is invalid. Please fix the format and save again.')
      setSaving(false)
      return
    }

    const upserts = Object.entries(values).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }))
    const { error: saveError } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })

    if (saveError) {
      setError(saveError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors'
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <p className="text-gray-500 text-sm mt-1">Manage contact info and homepage content stored in Supabase</p>
      </div>

      {!supabase && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 space-y-2">
          <p className="font-semibold">Supabase not configured</p>
          <p>Contact info is currently hardcoded in <code className="bg-amber-100 px-1 rounded">src/shared/constants/constants.js</code></p>
          <p>To enable live editing, set up Supabase and create the <code className="bg-amber-100 px-1 rounded">site_settings</code> table.</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-3 mb-5">Current Values (from constants.js)</h2>
        <div className="space-y-2 text-sm">
          {SETTINGS_KEYS.map(s => (
            <div key={s.key} className="flex items-center gap-3 py-2 border-b border-gray-50">
              <span className="text-gray-500 w-36 shrink-0 text-xs font-medium">{s.label}</span>
              <span className="text-gray-800 font-mono text-xs">{s.placeholder}</span>
            </div>
          ))}
        </div>
      </div>

      {supabase && (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-3">Contact Settings</h2>
            {SETTINGS_KEYS.map(s => (
              <div key={s.key}>
                <label className={labelCls}>{s.label}</label>
                <input
                  value={values[s.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                  className={inputCls}
                  placeholder={s.placeholder}
                />
                <p className="text-xs text-gray-400 mt-1">{s.hint}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-3">Homepage Content Manager</h2>
            <p className="text-xs text-gray-400 -mt-2">From here you can update, add, or delete hero slides, service cards, and testimonials.</p>

            {CONTENT_KEYS.map(item => (
              <div key={item.key}>
                <label className={labelCls}>{item.label}</label>
                <textarea
                  rows={item.key === 'hero_slides_json' ? 16 : 14}
                  value={values[item.key] || item.defaultValue}
                  onChange={e => setValues(v => ({ ...v, [item.key]: e.target.value }))}
                  className={inputCls + ' min-h-[220px] resize-y font-mono text-xs'}
                />
                <p className="text-xs text-gray-400 mt-1">{item.hint}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-semibold text-sm hover:bg-navy-800 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Save All Changes'}
            </button>
            {saved && <span className="text-green-600 text-sm font-medium">Saved!</span>}
          </div>
        </form>
      )}

      {/* SQL reference */}
      <div className="bg-slate-900 rounded-xl p-5">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Supabase SQL — Run once in your project</p>
        <pre className="text-green-400 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">{`-- Contact form submissions
create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  email text,
  service text,
  budget text,
  message text,
  submitted_at timestamptz default now()
);

-- Bookings
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  email text,
  date text,
  time text,
  meeting_type text,
  notes text,
  status text default 'pending',
  submitted_at timestamptz default now()
);

-- Portfolio projects
create table if not exists portfolio_projects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  subtitle text,
  category text,
  location text,
  year text,
  image text,
  gallery jsonb default '[]',
  description text,
  full_description text,
  highlights jsonb default '[]',
  client text,
  area text,
  duration text,
  featured boolean default false,
  order_index int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Blog posts
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  category text,
  cover_image text,
  content text,
  author text default 'Signature Works BD',
  published_at date default current_date,
  read_time text,
  tags jsonb default '[]',
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Site settings
create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- Enable public read/write (adjust with RLS for production)
alter table contact_submissions enable row level security;
alter table bookings enable row level security;
alter table portfolio_projects enable row level security;
alter table blog_posts enable row level security;
alter table site_settings enable row level security;

create policy "Allow all" on contact_submissions for all using (true);
create policy "Allow all" on bookings for all using (true);
create policy "Allow all" on portfolio_projects for all using (true);
create policy "Allow all" on blog_posts for all using (true);
create policy "Allow all" on site_settings for all using (true);`}</pre>
      </div>
    </div>
  )
}
