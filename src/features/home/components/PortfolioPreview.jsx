'use client'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/shared/components/ui/Container'
import Reveal from '@/shared/components/ui/Reveal'
import { portfolioData } from '@/data'

export default function PortfolioPreview({ projects = portfolioData }) {
  const preview = (projects?.length ? projects : portfolioData).slice(0, 4)

  return (
    <section id="portfolio" className="py-24 bg-slate-50 dark:bg-slate-900">
      <Container>
        {/* Header row with "View All" link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-gold-50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-500/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 dark:bg-gold-300" />
                Our Portfolio
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight" style={{ textWrap: 'balance' }}>
                <span className="block">Spaces We Have</span>
                <span className="block bg-gradient-to-r from-gold-500 via-amber-400 to-gold-300 bg-clip-text text-transparent">
                  Made Signature
                </span>
              </h2>
            </div>
          </Reveal>
          <Reveal>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 dark:text-gold-300 hover:text-gold-500 transition-colors shrink-0 group"
            >
              View All Projects
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {preview.map((project, i) => (
            <Reveal key={project.id || project.slug} delay={i * 80}>
              <Link
                href={`/portfolio/${project.slug}`}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/5] block"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                {/* Red accent line at top on hover */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-navy-900 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gold-500/15 text-gold-200 border border-gold-500/30 mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-gold-100 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">{project.location} · {project.year}</p>
                </div>

                {/* Arrow icon on hover */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/0 border border-white/0 flex items-center justify-center text-white/0 group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white transition-all duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
