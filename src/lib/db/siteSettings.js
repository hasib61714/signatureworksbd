import { createClient } from '@supabase/supabase-js'
import { heroSlidesData } from '@/features/home/data/heroData'
import { servicesData } from '@/features/home/data/servicesData'
import { testimonialsData } from '@/features/home/data/testimonialsData'
import { statsData } from '@/features/home/data/statsData'
import { processData } from '@/features/home/data/processData'
import { whyUsData } from '@/features/home/data/whyUsData'
import { aboutData } from '@/features/home/data/aboutData'
import { servicePages } from '@/features/services/data/servicePages'
import { PHONE_NUMBER, WHATSAPP_NUMBER, EMAIL, FACEBOOK_URL, WEBSITE_URL } from '@/shared/constants/constants'

const defaultHomeEditorial = {
  signaturePillars: [
    {
      title: 'Context-led planning',
      text: 'Every floor plan starts from site conditions, family routine, ventilation, and sunlight rather than a borrowed template.',
    },
    {
      title: 'Material-first thinking',
      text: 'We pair warm textures, practical finishes, and local build knowledge to create spaces that look refined and last longer.',
    },
    {
      title: 'Execution clarity',
      text: 'From concept to handover, timelines, scope, and site decisions stay clear so the final result matches the vision.',
    },
  ],
  projectJourney: [
    'Discovery call and requirement mapping',
    'Concept direction with mood and layout ideas',
    'Detailed build coordination and supervision',
    'Final styling, handover, and post-project support',
  ],
  serviceLens: [
    {
      title: 'Residential spaces',
      text: 'Modern homes designed around comfort, storage, natural light, and family flow.',
    },
    {
      title: 'Commercial interiors',
      text: 'Office and retail environments that feel branded, efficient, and client-ready.',
    },
    {
      title: 'Renovation upgrades',
      text: 'Smarter transformations for dated structures without losing budget control.',
    },
  ],
}

export const defaultContactSettings = {
  phoneNumber: PHONE_NUMBER,
  whatsappNumber: WHATSAPP_NUMBER,
  email: EMAIL,
  facebookUrl: FACEBOOK_URL,
  websiteUrl: WEBSITE_URL,
}

export const managedPageDefaults = {
  servicesPage: {
    label: 'Our Services',
    title: 'Our',
    accent: 'Services',
    description: 'Browse each service in a clearer way, with page-specific information on scope, workflow, and the right next step.',
    cards: [
      { title: 'Design', text: 'Planning-led concepts with visual clarity.' },
      { title: 'Build', text: 'Execution discipline from start to finish.' },
      { title: 'Upgrade', text: 'Smarter transformation for existing spaces.' },
    ],
  },
  portfolioPage: {
    label: 'Built Work',
    title: 'Project',
    accent: 'Portfolio',
    description: 'A curated look at residential, commercial, and interior work shaped by planning, detailing, and disciplined execution.',
    cards: [
      { title: 'Residential', text: 'Comfort-driven homes with stronger layout logic.' },
      { title: 'Commercial', text: 'Branded spaces that feel practical and polished.' },
      { title: 'Renovation', text: 'Meaningful transformation without a generic feel.' },
    ],
  },
  blogPage: {
    label: 'Insights Library',
    title: 'Design',
    accent: 'Journal',
    description: 'Helpful articles on planning, materials, cost decisions, and real project lessons for home and commercial work in Bangladesh.',
    cards: [
      { title: 'Budget clarity', text: 'Understand cost drivers before you build.' },
      { title: 'Material guidance', text: 'Choose finishes that suit climate and use.' },
      { title: 'Project planning', text: 'Reduce mistakes with better decisions early.' },
    ],
  },
  bookPage: {
    label: 'Free Consultation',
    title: 'Book',
    accent: 'Consultation',
    description: 'Talk with our team about design direction, budgeting, renovation, or construction planning in a focused 30-minute session.',
    cards: [
      { title: 'No pressure', text: 'A clear discussion before you commit.' },
      { title: 'Project focus', text: 'Advice based on your real needs and site.' },
      { title: 'Next steps', text: 'Get a clearer direction for moving ahead.' },
    ],
  },
  calculatorPage: {
    label: 'Planning Tool',
    title: 'Cost',
    accent: 'Calculator',
    description: 'Get a quick budget range for construction, renovation, or interior work before moving into detailed planning.',
    cards: [
      { title: 'Quick estimate', text: 'Get a fast early-stage budget range.' },
      { title: 'Dhaka context', text: 'Built around practical local assumptions.' },
      { title: 'Better planning', text: 'Start decisions with more clarity.' },
    ],
  },
}

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

    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? parsed : fallback
    }

    if (fallback && typeof fallback === 'object') {
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? { ...fallback, ...parsed }
        : fallback
    }

    return parsed ?? fallback
  } catch {
    return fallback
  }
}

async function getSettingsMap(keys = []) {
  const sb = getClient()
  if (!sb) return {}

  try {
    let query = sb.from('site_settings').select('key,value')
    if (keys.length) query = query.in('key', keys)

    const { data, error } = await query
    if (error || !data) return {}

    return Object.fromEntries(data.map((row) => [row.key, row.value]))
  } catch {
    return {}
  }
}

export async function getHomeContent() {
  const map = await getSettingsMap([
    'hero_slides_json',
    'services_home_json',
    'testimonials_json',
    'stats_json',
    'process_json',
    'why_us_json',
    'about_home_json',
    'home_editorial_json',
  ])

  return {
    heroSlides: safeParse(map.hero_slides_json, heroSlidesData),
    services: safeParse(map.services_home_json, servicesData),
    testimonials: safeParse(map.testimonials_json, testimonialsData),
    stats: safeParse(map.stats_json, statsData),
    process: safeParse(map.process_json, processData),
    whyUs: safeParse(map.why_us_json, whyUsData),
    about: safeParse(map.about_home_json, aboutData),
    editorial: safeParse(map.home_editorial_json, defaultHomeEditorial),
  }
}

export async function getServicesContent() {
  const map = await getSettingsMap(['services_page_json', 'service_pages_json'])

  return {
    page: safeParse(map.services_page_json, managedPageDefaults.servicesPage),
    services: safeParse(map.service_pages_json, servicePages),
  }
}

export async function getContactSettings() {
  const map = await getSettingsMap(['phone_number', 'whatsapp_number', 'email', 'facebook_url', 'website_url'])

  return {
    phoneNumber: map.phone_number || PHONE_NUMBER,
    whatsappNumber: map.whatsapp_number || WHATSAPP_NUMBER,
    email: map.email || EMAIL,
    facebookUrl: map.facebook_url || FACEBOOK_URL,
    websiteUrl: map.website_url || WEBSITE_URL,
  }
}

export async function getManagedPageContent(pageKey) {
  const settingsKeys = {
    portfolio: 'portfolio_page_json',
    blog: 'blog_page_json',
    book: 'book_page_json',
    calculator: 'calculator_page_json',
  }

  const defaults = {
    portfolio: managedPageDefaults.portfolioPage,
    blog: managedPageDefaults.blogPage,
    book: managedPageDefaults.bookPage,
    calculator: managedPageDefaults.calculatorPage,
  }

  const key = settingsKeys[pageKey]
  if (!key) return null

  const map = await getSettingsMap([key])
  return safeParse(map[key], defaults[pageKey])
}
