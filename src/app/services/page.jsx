import Link from 'next/link'
import { ArrowRight, Building2, Hammer, RefreshCcw, Ruler, Sofa } from 'lucide-react'
import Container from '@/shared/components/ui/Container'
import PageHero from '@/shared/components/layout/PageHero'
import { getServicesContent } from '@/lib/db/siteSettings'

export const metadata = {
  title: 'Services',
  description: 'Explore the dedicated architectural design, construction, interior design, and renovation services offered by Signature Works.',
}

export const dynamic = 'force-dynamic'

const icons = {
  'architectural-design': Ruler,
  construction: Building2,
  'interior-design': Sofa,
  renovation: RefreshCcw,
}

export default async function ServicesPage() {
  const { page, services } = await getServicesContent()

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      <Container>
        <div className="mb-12">
          <PageHero
            label={page.label}
            title={page.title}
            accent={page.accent}
            description={page.description}
            cards={page.cards}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = icons[service.slug] || Hammer

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/70"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-300">
                  <Icon className="h-6 w-6" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {service.label}
                </p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-navy-900 dark:text-white" style={{ textWrap: 'balance' }}>
                  <span className="block">{service.title}</span>
                  <span className="block text-gold-600 dark:text-gold-300">{service.accent}</span>
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {service.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(service.idealFor || []).slice(0, 2).map((item) => (
                    <span key={item} className="rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 text-[10px] font-semibold text-gold-700 dark:border-gold-500/20 dark:bg-gold-500/10 dark:text-gold-300">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition-colors group-hover:text-gold-500 dark:text-gold-300">
                  <span>View details</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </Container>
    </main>
  )
}
