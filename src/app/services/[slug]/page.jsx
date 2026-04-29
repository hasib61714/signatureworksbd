import Image from 'next/image'
import { ArrowRight, BadgeCheck, Building2, RefreshCcw, Ruler, Sofa, Sparkles } from 'lucide-react'
import { notFound } from 'next/navigation'
import Container from '@/shared/components/ui/Container'
import Button from '@/shared/components/ui/Button'
import PageHero from '@/shared/components/layout/PageHero'
import ServiceFaqs from '@/features/services/components/ServiceFaqs'
import ServiceInquiryForm from '@/features/services/components/ServiceInquiryForm'
import { getServicesContent } from '@/lib/db/siteSettings'

const icons = {
  'architectural-design': Ruler,
  construction: Building2,
  'interior-design': Sofa,
  renovation: RefreshCcw,
}

export const dynamic = 'force-dynamic'

function getEmbedUrl(url) {
  if (!url) return ''
  if (url.includes('youtube.com/watch?v=')) {
    return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`
  }
  if (url.includes('youtu.be/')) {
    return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`
  }
  return url
}

export async function generateStaticParams() {
  const { services } = await getServicesContent()
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }) {
  const { services } = await getServicesContent()
  const service = services.find((item) => item.slug === params.slug)

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: `${service.navLabel} | Signature Works`,
    description: service.description,
  }
}

export default async function ServiceDetailPage({ params }) {
  const { services } = await getServicesContent()
  const service = services.find((item) => item.slug === params.slug)

  if (!service) notFound()

  const Icon = icons[service.slug] || Building2
  const videoUrl = service.videoUrl || service.video_url

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      <Container>
        <div className="mb-12">
          <PageHero
            label={service.label}
            title={service.title}
            accent={service.accent}
            description={service.description}
            cards={service.cards}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950/70">
            <div className="relative aspect-[16/10]">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-flex rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-200">
                  {service.navLabel}
                </span>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">{service.summary}</p>
              </div>
            </div>
          </section>

          {videoUrl && (
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Video showcase</p>
                  <h2 className="mt-1 text-xl font-black text-navy-900 dark:text-white">Service walkthrough</h2>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 aspect-video bg-slate-950">
                <iframe
                  src={getEmbedUrl(videoUrl)}
                  title={`${service.navLabel} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          <ServiceInquiryForm serviceName={service.navLabel} />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-300">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-black text-navy-900 dark:text-white" style={{ textWrap: 'balance' }}>
                <span className="block">Service</span>
                <span className="block text-gold-600 dark:text-gold-300">focus</span>
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {service.cards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-navy-900/60">
                  <p className="text-sm font-bold text-navy-900 dark:text-white">{card.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-navy-900 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-6 text-white shadow-xl shadow-navy-950/15">
            <h2 className="text-2xl font-black" style={{ textWrap: 'balance' }}>
              <span className="block">Best fit</span>
              <span className="block text-gold-300">projects</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This service works especially well when the goal is clear, the scope needs structure, and better execution decisions matter from the beginning.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {service.idealFor.map((item) => (
                <span key={item} className="rounded-full border border-gold-400/20 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-200">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button href="/book" variant="primary" className="w-full justify-center">
                <span>Book consultation</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/#contact" variant="outline-white" className="w-full justify-center">
                Get a quote
              </Button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-black text-navy-900 dark:text-white" style={{ textWrap: 'balance' }}>
                <span className="block">How it</span>
                <span className="block text-gold-600 dark:text-gold-300">flows</span>
              </h2>
            </div>

            <div className="space-y-3">
              {service.workflow.map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-navy-900/60">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-900 to-gold-500 text-xs font-bold text-white">
                    0{index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-300">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-black text-navy-900 dark:text-white" style={{ textWrap: 'balance' }}>
                <span className="block">Expected</span>
                <span className="block text-gold-600 dark:text-gold-300">outcomes</span>
              </h2>
            </div>

            <div className="grid gap-3">
              {service.outcomes.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-navy-900/60">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600 dark:text-gold-300" />
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/70 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-300">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-black text-navy-900 dark:text-white" style={{ textWrap: 'balance' }}>
                <span className="block">What you</span>
                <span className="block text-gold-600 dark:text-gold-300">get</span>
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {service.includes.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-navy-900/60">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600 dark:text-gold-300" />
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="lg:col-span-2">
            <ServiceFaqs faqs={service.faqs} />
          </div>
        </div>
      </Container>
    </main>
  )
}
