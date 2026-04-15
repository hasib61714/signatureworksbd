import { createClient } from '@supabase/supabase-js'
import { blogData } from '@/data/blogData'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function getBlogPosts() {
  const sb = getClient()
  if (!sb) return blogData
  const { data, error } = await sb
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  if (error || !data || data.length === 0) return blogData
  return data
}

export async function getBlogBySlug(slug) {
  const sb = getClient()
  if (sb) {
    const { data } = await sb
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()
    if (data) return data
  }
  return blogData.find(p => p.slug === slug) || null
}
