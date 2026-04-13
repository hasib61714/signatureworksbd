import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/shared/components/ui/Container'
import { blogData } from '@/data'
import BlogContent from '@/features/blog/components/BlogContent'

export async function generateStaticParams() {
  return blogData.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const post = blogData.find(p => p.slug === params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.coverImage] },
  }
}

export default function BlogPostPage({ params }) {
  const post = blogData.find(p => p.slug === params.slug)
  if (!post) notFound()

  const currentIdx = blogData.findIndex(p => p.slug === params.slug)
  const prevPost = blogData[currentIdx - 1] || null
  const nextPost = blogData[currentIdx + 1] || null

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      {/* Hero */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-navy-950 via-white/40 dark:via-navy-950/40 to-transparent" />
      </div>

      <Container className="max-w-3xl mt-[-60px] relative">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white text-sm mb-6 transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          All Articles
        </Link>

        {/* Header */}
        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gold-500/20 text-gold-600 dark:text-gold-400 border border-gold-500/30 mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white font-serif leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm mb-8 pb-8 border-b border-slate-100 dark:border-white/[0.08]">
          <span className="text-slate-500 dark:text-slate-400">{post.author}</span>
          <span>·</span>
          <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        {/* Content */}
        <BlogContent content={post.content} />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-slate-100 dark:border-white/[0.08]">
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-navy-900 dark:bg-navy-950 border border-white/[0.08] rounded-2xl p-8 text-center">
          <h3 className="text-white text-xl font-bold font-serif mb-2">Ready to start your project?</h3>
          <p className="text-slate-400 text-sm mb-6">Get a free consultation from our team. No obligation.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 text-navy-900 font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-300 active:scale-95">
              Book Free Consultation
            </Link>
            <Link href="/calculator" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-semibold text-sm hover:bg-white/20 transition-all duration-300">
              Cost Calculator
            </Link>
          </div>
        </div>

        {/* Prev / Next */}
        {(prevPost || nextPost) && (
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="group flex items-start gap-3 bg-white dark:bg-navy-900 border border-slate-100 dark:border-white/[0.08] rounded-2xl p-5 hover:border-gold-500/30 transition-colors">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 group-hover:-translate-x-1 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Previous</p>
                  <p className="text-navy-900 dark:text-white text-sm font-semibold font-serif line-clamp-2">{prevPost.title}</p>
                </div>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} className="group flex items-start gap-3 bg-white dark:bg-navy-900 border border-slate-100 dark:border-white/[0.08] rounded-2xl p-5 hover:border-gold-500/30 transition-colors text-right justify-end">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Next</p>
                  <p className="text-navy-900 dark:text-white text-sm font-semibold font-serif line-clamp-2">{nextPost.title}</p>
                </div>
                <svg className="w-5 h-5 text-slate-400 mt-0.5 group-hover:translate-x-1 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : <div />}
          </div>
        )}
      </Container>
    </main>
  )
}
