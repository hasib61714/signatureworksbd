import Image from 'next/image'
import Link from 'next/link'
import Container from '@/shared/components/ui/Container'
import Reveal from '@/shared/components/ui/Reveal'
import { blogData } from '@/data'

export default function BlogSection() {
  const posts = blogData.slice(0, 3)

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <Container>
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-gold-50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-500/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 dark:bg-gold-300" />
                From Our Blog
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight" style={{ textWrap: 'balance' }}>
                <span className="block">Insights &</span>
                <span className="block bg-gradient-to-r from-gold-500 via-amber-400 to-gold-300 bg-clip-text text-transparent">
                  Inspiration
                </span>
              </h2>
            </div>
          </Reveal>
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 dark:text-gold-300 hover:text-gold-500 transition-colors shrink-0 group"
            >
              View all articles
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 100}>
              <Link href={`/blog/${post.slug}`} className="group block bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.06] hover:border-gold-200 dark:hover:border-gold-500/20 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300">
                {/* Cover image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-navy-900/90 text-gold-200">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span>{post.publishedAt}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-semibold text-base leading-snug mb-2 group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-gold-600 dark:text-gold-300">
                    Read more
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
