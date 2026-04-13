import Link from 'next/link'
import Container from '@/shared/components/ui/Container'
import SectionLabel from '@/shared/components/ui/SectionLabel'
import { blogData } from '@/data'

export const metadata = {
  title: 'Blog — Design & Construction Insights',
  description: 'Expert articles on construction costs, interior design, materials, and project management in Bangladesh — from the team at Signature Works BD.',
}

function BlogCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col bg-white dark:bg-navy-900 border border-slate-100 dark:border-white/[0.06] rounded-2xl overflow-hidden hover:border-gold-500/30 dark:hover:border-gold-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-navy-900/10 dark:hover:shadow-gold-500/5">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gold-500/90 text-navy-900">
          {post.category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 text-slate-400 text-xs mb-3">
          <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readTime}</span>
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

export default function BlogPage() {
  const featured = blogData[0]
  const rest = blogData.slice(1)

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      <Container>
        <div className="text-center mb-14">
          <SectionLabel>Insights</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 dark:text-white font-serif mt-4">
            Design & Construction <span className="text-light-gradient">Insights</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Practical knowledge on construction costs, materials, design decisions, and project management — from our team.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="group relative block rounded-3xl overflow-hidden mb-12 aspect-[21/9] min-h-[280px]">
          <img
            src={featured.coverImage}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
              <span>{new Date(featured.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </main>
  )
}
