import { createClient } from '@supabase/supabase-js'
import { portfolioData } from '@/features/portfolio/data/portfolioData'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function getPortfolioProjects() {
  const sb = getClient()
  if (!sb) return portfolioData
  const { data, error } = await sb
    .from('portfolio_projects')
    .select('*')
    .order('order_index', { ascending: true })
  if (error || !data || data.length === 0) return portfolioData
  return data
}

export async function getPortfolioBySlug(slug) {
  const sb = getClient()
  if (sb) {
    const { data } = await sb
      .from('portfolio_projects')
      .select('*')
      .eq('slug', slug)
      .single()
    if (data) return data
  }
  return portfolioData.find(p => p.slug === slug) || null
}
