import Image from 'next/image'
import Link from 'next/link'
import Container from '@/shared/components/ui/Container'
import PageHero from '@/shared/components/layout/PageHero'
import { getBlogPosts } from '@/lib/db/blog'
import { getManagedPageContent } from '@/lib/db/siteSettings'

export const metadata = {
  title: 'Blog — Design & Construction Insights',
  description: 'Expert articles on construction costs, interior design, materials, and project management in Bangladesh — from the team at Signature Works BD.',
}

export const dynamic = 'force-dynamic'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function BlogCard({ post }) {
  const coverImage = post.coverImage || post.cover_image
  const publishedAt = post.publishedAt || post.published_at
  const readTime = post.readTime || post.read_time

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white dark:bg-navy-900 border border-slate-100 dark:border-white/[0.06] rounded-2xl overflow-hidden hover:border-gold-500/30 dark:hover:border-gold-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-navy-900/10 dark:hover:shadow-gold-500/5">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gold-500/90 text-navy-900">
          {post.category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 text-slate-400 text-xs mb-3">
          <span>{formatDate(publishedAt)}</span>
          <span>·</span>
          <span>{readTime}</span>
        </div>
        <h2 className="text-navy-900 dark:text-white font-bold font-serif text-lg leading-snug mb-3 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
          {post.title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1">{post.excerpt}</p>
        <div className="flex items-center gap-2 mt-5 text-gold-600 dark:text-gold-400 text-sm font-semibold">
          Read Article
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default async function BlogPage() {
  const [pageContent, posts] = await Promise.all([
    getManagedPageContent('blog'),
    getBlogPosts(),
  ])

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      <Container>
        <div className="mb-14">
          <PageHero
            label={pageContent.label}
            title={pageContent.title}
            accent={pageContent.accent}
            description={pageContent.description}
            cards={pageContent.cards}
          />
        </div>

        {featured ? (
          <>
            <Link href={`/blog/${featured.slug}`} className="group relative block rounded-3xl overflow-hidden mb-12 aspect-[21/9] min-h-[280px]">
              <Image
                src={featured.coverImage || featured.cover_image}
                alt={featured.title}
                fill
                sizes="100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gold-500/90 text-navy-900 mb-3">
                  {featured.category}
                </span>
                <h2 className="text-white text-2xl sm:text-3xl font-bold font-serif max-w-2xl mb-2 group-hover:text-gold-300 transition-colors">
                  {featured.title}
                </h2>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <span>{formatDate(featured.publishedAt || featured.published_at)}</span>
                  <span>·</span>
                  <span>{featured.readTime || featured.read_time}</span>
                </div>
              </div>
            </Link>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <BlogCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
            No blog posts yet. Add a post from the admin panel.
          </div>
        )}
      </Container>
    </main>
  )
}
