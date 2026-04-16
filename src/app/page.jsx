import Link from 'next/link'
import ExpandableText from '@/shared/components/ui/ExpandableText'
import Container from '@/shared/components/ui/Container'
import HeroSection from '@/features/home/components/HeroSection'
import { getHomeContent } from '@/lib/db/siteSettings'
import { getBlogPosts } from '@/lib/db/blog'
import { getPortfolioProjects } from '@/lib/db/portfolio'
import StatsSection from '@/features/home/components/StatsSection'
import ServicesSection from '@/features/home/components/ServicesSection'
import PortfolioPreview from '@/features/home/components/PortfolioPreview'
import ProcessSection from '@/features/home/components/ProcessSection'
import AboutSection from '@/features/home/components/AboutSection'
import WhyUsSection from '@/features/home/components/WhyUsSection'
import TestimonialsSection from '@/features/home/components/TestimonialsSection'
import BlogSection from '@/features/home/components/BlogSection'
import ContactSection from '@/features/home/components/ContactSection'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { heroSlides, services, testimonials, stats, process, whyUs, about, editorial } = await getHomeContent()
  const [blogPosts, portfolioProjects] = await Promise.all([
    getBlogPosts(),
    getPortfolioProjects(),
  ])
  const signaturePillars = editorial?.signaturePillars || []
  const projectJourney = editorial?.projectJourney || []
  const serviceLens = editorial?.serviceLens || []

  return (
    <main className="overflow-x-hidden bg-white dark:bg-slate-950">
      <HeroSection slides={heroSlides} />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.14),transparent_30%)]" />

        <Container className="relative py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
                Signature design direction
              </span>
              <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl" style={{ textWrap: 'balance' }}>
                <span className="block">A more original,</span>
                <span className="block text-amber-200">studio-style layout for your brand.</span>
              </h2>
              <ExpandableText
                text="This homepage is now arranged to feel more editorial and project-focused, so it stands apart instead of looking like another copied commercial layout."
                className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
              />

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {signaturePillars.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Project flow</p>
                  <h3 className="mt-1 text-xl font-bold text-white">How clients move with us</h3>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  Structured & clear
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {projectJourney.map((step, index) => (
                  <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-slate-900/40 px-4 py-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-900 to-gold-500 text-xs font-bold text-white">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-6 text-slate-200">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Explore portfolio
                </Link>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Book consultation
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <PortfolioPreview projects={portfolioProjects} />
      <ServicesSection services={services} />

      <section className="bg-stone-50 py-16 dark:bg-slate-900/40 lg:py-20">
        <Container>
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700 dark:border-gold-500/20 dark:bg-gold-500/10 dark:text-gold-300">
                Designed to feel distinct
              </span>
              <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl" style={{ textWrap: 'balance' }}>
                <span className="block">Built around your work,</span>
                <span className="block text-gold-600 dark:text-gold-300">not a generic clone.</span>
              </h2>
            </div>
            <ExpandableText
              text="The updated landing flow now puts project experience, service clarity, and transformation stories first so the brand feels more memorable and premium."
              className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {serviceLens.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/70">
                <div className="mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-navy-900 via-gold-500 to-amber-300" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <StatsSection stats={stats} />
      <ProcessSection steps={process} />
      <AboutSection about={about} />
      <WhyUsSection items={whyUs} />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection posts={blogPosts} />
      <ContactSection />
    </main>
  )
}
