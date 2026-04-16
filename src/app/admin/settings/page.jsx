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
import { servicePages } from '@/features/services/data/servicePages'
import { managedPageDefaults } from '@/lib/db/siteSettings'
import MediaUploadField from '@/shared/components/ui/MediaUploadField'

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
    hint: 'You can edit text, links, buttons, and image URLs here.',
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
  {
    key: 'home_editorial_json',
    label: 'Homepage Extra Story Blocks',
    hint: 'Controls the editorial cards, journey steps, and highlight blocks on the homepage.',
    defaultValue: JSON.stringify({
      signaturePillars: [
        { title: 'Context-led planning', text: 'Every floor plan starts from site conditions, family routine, ventilation, and sunlight rather than a borrowed template.' },
        { title: 'Material-first thinking', text: 'We pair warm textures, practical finishes, and local build knowledge to create spaces that look refined and last longer.' },
        { title: 'Execution clarity', text: 'From concept to handover, timelines, scope, and site decisions stay clear so the final result matches the vision.' },
      ],
      projectJourney: [
        'Discovery call and requirement mapping',
        'Concept direction with mood and layout ideas',
        'Detailed build coordination and supervision',
        'Final styling, handover, and post-project support',
      ],
      serviceLens: [
        { title: 'Residential spaces', text: 'Modern homes designed around comfort, storage, natural light, and family flow.' },
        { title: 'Commercial interiors', text: 'Office and retail environments that feel branded, efficient, and client-ready.' },
        { title: 'Renovation upgrades', text: 'Smarter transformations for dated structures without losing budget control.' },
      ],
    }, null, 2),
  },
  {
    key: 'services_page_json',
    label: 'Services Landing Page',
    hint: 'Controls the hero section for the main services page.',
    defaultValue: JSON.stringify(managedPageDefaults.servicesPage, null, 2),
  },
  {
    key: 'service_pages_json',
    label: 'All Service Detail Pages',
    hint: 'Full control of service titles, images, FAQs, idealFor, workflow, and optional videoUrl.',
    defaultValue: JSON.stringify(servicePages, null, 2),
  },
  {
    key: 'portfolio_page_json',
    label: 'Portfolio Landing Page',
    hint: 'Controls the portfolio page hero copy.',
    defaultValue: JSON.stringify(managedPageDefaults.portfolioPage, null, 2),
  },
  {
    key: 'blog_page_json',
    label: 'Blog Landing Page',
    hint: 'Controls the blog page hero copy.',
    defaultValue: JSON.stringify(managedPageDefaults.blogPage, null, 2),
  },
  {
    key: 'book_page_json',
    label: 'Booking Page',
    hint: 'Controls the booking page hero copy and cards.',
    defaultValue: JSON.stringify(managedPageDefaults.bookPage, null, 2),
  },
  {
    key: 'calculator_page_json',
    label: 'Calculator Page',
    hint: 'Controls the cost calculator page hero content.',
    defaultValue: JSON.stringify(managedPageDefaults.calculatorPage, null, 2),
  },
]

function tryParseJson(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function formatFieldLabel(label) {
  return String(label)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function createEmptyValue(sample) {
  if (Array.isArray(sample)) return []
  if (sample && typeof sample === 'object') {
    return Object.fromEntries(Object.entries(sample).map(([key, value]) => [key, createEmptyValue(value)]))
  }
  if (typeof sample === 'boolean') return false
  if (typeof sample === 'number') return 0
  return ''
}

function getAtPath(target, path) {
  return path.reduce((acc, key) => acc?.[key], target)
}

function setAtPath(target, path, nextValue) {
  if (path.length === 0) return nextValue

  const [head, ...rest] = path

  if (Array.isArray(target)) {
    const clone = [...target]
    clone[head] = setAtPath(target?.[head], rest, nextValue)
    return clone
  }

  return {
    ...target,
    [head]: setAtPath(target?.[head], rest, nextValue),
  }
}

function addItemAtPath(target, path) {
  const collection = getAtPath(target, path)
  if (!Array.isArray(collection)) return target
  const template = collection.length > 0 ? createEmptyValue(collection[0]) : ''
  return setAtPath(target, path, [...collection, template])
}

function removeItemAtPath(target, path, index) {
  const collection = getAtPath(target, path)
  if (!Array.isArray(collection)) return target
  return setAtPath(target, path, collection.filter((_, itemIndex) => itemIndex !== index))
}

function isLongTextField(label, value) {
  const normalized = String(label).toLowerCase()
  return typeof value === 'string' && (
    value.length > 80 ||
    /description|content|message|text|summary|excerpt|answer|details|full|story|paragraph/.test(normalized)
  )
}

function isUrlField(label) {
  return /image|url|href|video/.test(String(label).toLowerCase())
}

function StructuredField({ label, value, path = [], onValueChange, onAddItem, onRemoveItem, depth = 0 }) {
  const fieldLabel = formatFieldLabel(label)

  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">{fieldLabel}</p>
          <button
            type="button"
            onClick={() => onAddItem(path)}
            className="rounded-lg border border-gold-200 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 hover:bg-gold-100"
          >
            + Add Item
          </button>
        </div>

        {value.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            No items yet. Use Add Item.
          </div>
        )}

        {value.map((item, index) => (
          <div key={`${fieldLabel}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Item {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveItem(path, index)}
                className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                Remove
              </button>
            </div>

            <StructuredField
              label={`${label}_${index}`}
              value={item}
              path={[...path, index]}
              onValueChange={onValueChange}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
              depth={depth + 1}
            />
          </div>
        ))}
      </div>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <div className={depth > 0 ? 'space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4' : 'space-y-4'}>
        {depth > 0 && <p className="text-sm font-semibold text-slate-700">{fieldLabel}</p>}
        {Object.entries(value).map(([key, nestedValue]) => (
          <StructuredField
            key={`${fieldLabel}-${key}`}
            label={key}
            value={nestedValue}
            path={[...path, key]}
            onValueChange={onValueChange}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            depth={depth + 1}
          />
        ))}
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onValueChange(path, e.target.checked)}
          className="h-4 w-4 accent-gold-500"
        />
        <span>{fieldLabel}</span>
      </label>
    )
  }

  const sharedCls = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors'

  if (typeof value === 'number') {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{fieldLabel}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onValueChange(path, Number(e.target.value || 0))}
          className={sharedCls}
        />
      </div>
    )
  }

  if (isLongTextField(label, value)) {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{fieldLabel}</label>
        <textarea
          rows={4}
          value={value ?? ''}
          onChange={(e) => onValueChange(path, e.target.value)}
          className={sharedCls + ' resize-y min-h-[110px]'}
        />
      </div>
    )
  }

  if (isUrlField(label)) {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{fieldLabel}</label>
        <MediaUploadField
          label={fieldLabel}
          value={value ?? ''}
          onChange={(nextValue) => onValueChange(path, nextValue)}
          placeholder="Paste URL or upload file"
          hint="You can paste a URL or click Upload File."
          className={sharedCls}
        />
      </div>
    )
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{fieldLabel}</label>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onValueChange(path, e.target.value)}
        className={sharedCls}
      />
    </div>
  )
}

export default function SettingsPage() {
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [openSection, setOpenSection] = useState('hero_slides_json')

  useEffect(() => {
    const defaults = Object.fromEntries([
      ...SETTINGS_KEYS.map((item) => [item.key, '']),
      ...CONTENT_KEYS.map((item) => [item.key, item.defaultValue]),
    ])

    if (!supabase) {
      setValues(defaults)
      return
    }

    supabase.from('site_settings').select('*')
      .then(({ data }) => {
        const map = { ...defaults }
        data?.forEach((row) => { map[row.key] = row.value })
        setValues(map)
      })
  }, [])

  const updateStructuredContent = (key, defaultValue, updater) => {
    setValues((prev) => {
      const fallback = tryParseJson(defaultValue, {})
      const currentValue = tryParseJson(prev[key] || defaultValue, fallback)
      const updatedValue = updater(currentValue)

      return {
        ...prev,
        [key]: JSON.stringify(updatedValue, null, 2),
      }
    })
  }

  const handleSave = async (e) => {
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
      setError('One of the content sections is invalid. Please review the form and save again.')
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
        <h1 className="text-2xl font-bold text-gray-900">Full Website CMS</h1>
        <p className="text-gray-500 text-sm mt-1">Now form-based — content দিলে JSON automatically generate হয়ে save হবে</p>
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
        <h2 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-3 mb-5">Current Values</h2>
        <div className="space-y-2 text-sm">
          {SETTINGS_KEYS.map((s) => (
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
            {SETTINGS_KEYS.map((s) => (
              <div key={s.key}>
                <label className={labelCls}>{s.label}</label>
                <input
                  value={values[s.key] || ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [s.key]: e.target.value }))}
                  className={inputCls}
                  placeholder={s.placeholder}
                />
                <p className="text-xs text-gray-400 mt-1">{s.hint}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="font-semibold text-gray-900 text-sm">Full Website Content Manager</h2>
              <p className="text-xs text-gray-400 mt-1">Text, image URL, video URL, button link — সব form input থেকে edit করুন. JSON auto create হবে.</p>
            </div>

            {CONTENT_KEYS.map((item) => {
              const rawValue = values[item.key] || item.defaultValue
              const fallback = tryParseJson(item.defaultValue, {})
              const parsedValue = tryParseJson(rawValue, fallback)
              const hasValidJson = rawValue ? tryParseJson(rawValue, null) !== null : true
              const itemCount = Array.isArray(parsedValue) ? parsedValue.length : Object.keys(parsedValue || {}).length

              return (
                <div key={item.key} className="rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenSection((prev) => prev === item.key ? '' : item.key)}
                    className="w-full px-4 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.hint} Upload button use করলে URL auto fill হবে.</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{itemCount} fields</span>
                      <span className="text-slate-400 text-xs">{openSection === item.key ? 'Hide' : 'Edit'}</span>
                    </div>
                  </button>

                  {openSection === item.key && (
                    <div className="border-t border-slate-200 p-4 space-y-4 bg-slate-50/40">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                        Form mode active. এখানে content edit করলে JSON automatically generate হয়ে database এ save হবে.
                      </div>

                      {hasValidJson ? (
                        <StructuredField
                          label={item.label}
                          value={parsedValue}
                          path={[]}
                          onValueChange={(path, nextValue) => updateStructuredContent(item.key, item.defaultValue, (current) => setAtPath(current, path, nextValue))}
                          onAddItem={(path) => updateStructuredContent(item.key, item.defaultValue, (current) => addItemAtPath(current, path))}
                          onRemoveItem={(path, index) => updateStructuredContent(item.key, item.defaultValue, (current) => removeItemAtPath(current, path, index))}
                        />
                      ) : (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                            This section contains invalid saved JSON. Please fix it below once.
                          </div>
                          <textarea
                            rows={12}
                            value={rawValue}
                            onChange={(e) => setValues((prev) => ({ ...prev, [item.key]: e.target.value }))}
                            className={inputCls + ' min-h-[220px] resize-y font-mono text-xs'}
                          />
                        </div>
                      )}

                      <details className="rounded-xl border border-slate-200 bg-white p-3">
                        <summary className="cursor-pointer text-xs font-semibold text-slate-600">Advanced JSON Editor</summary>
                        <textarea
                          rows={10}
                          value={rawValue}
                          onChange={(e) => setValues((prev) => ({ ...prev, [item.key]: e.target.value }))}
                          className={inputCls + ' mt-3 min-h-[180px] resize-y font-mono text-xs'}
                        />
                      </details>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-semibold text-sm hover:bg-navy-800 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Save All Changes'}
            </button>
            {saved && <span className="text-green-600 text-sm font-medium">Saved!</span>}
          </div>
        </form>
      )}

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
  budget text,
  team jsonb default '[]',
  before_image text,
  after_image text,
  video_url text,
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
create policy "Allow all" on site_settings for all using (true);

-- Upgrade existing portfolio table if already created earlier
alter table if exists portfolio_projects add column if not exists budget text;
alter table if exists portfolio_projects add column if not exists team jsonb default '[]';
alter table if exists portfolio_projects add column if not exists before_image text;
alter table if exists portfolio_projects add column if not exists after_image text;
alter table if exists portfolio_projects add column if not exists video_url text;

-- Storage bucket for image/video uploads
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;`}</pre>
      </div>
    </div>
  )
}
