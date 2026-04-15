import { createClient } from '@supabase/supabase-js'
import { heroSlidesData } from '@/features/home/data/heroData'
import { servicesData } from '@/features/home/data/servicesData'
import { testimonialsData } from '@/features/home/data/testimonialsData'
import { statsData } from '@/features/home/data/statsData'
import { processData } from '@/features/home/data/processData'
import { whyUsData } from '@/features/home/data/whyUsData'
import { aboutData } from '@/features/home/data/aboutData'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function safeParse(value, fallback) {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function safeParseObject(value, fallback) {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export async function getHomeContent() {
  const defaults = {
    heroSlides: heroSlidesData,
    services: servicesData,
    testimonials: testimonialsData,
    stats: statsData,
    process: processData,
    whyUs: whyUsData,
    about: aboutData,
  }

  const sb = getClient()
  if (!sb) return defaults

  try {
    const { data, error } = await sb
      .from('site_settings')
      .select('key,value')
      .in('key', ['hero_slides_json', 'services_home_json', 'testimonials_json', 'stats_json', 'process_json', 'why_us_json', 'about_home_json'])

    if (error || !data) return defaults

    const map = Object.fromEntries(data.map((row) => [row.key, row.value]))

    return {
      heroSlides: safeParse(map.hero_slides_json, heroSlidesData),
      services: safeParse(map.services_home_json, servicesData),
      testimonials: safeParse(map.testimonials_json, testimonialsData),
      stats: safeParse(map.stats_json, statsData),
      process: safeParse(map.process_json, processData),
      whyUs: safeParse(map.why_us_json, whyUsData),
      about: safeParseObject(map.about_home_json, aboutData),
    }
  } catch {
    return defaults
  }
}
