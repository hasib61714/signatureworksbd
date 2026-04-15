'use client'
import Container from '@/shared/components/ui/Container'
import Button from '@/shared/components/ui/Button'
import SectionHeader from '@/shared/components/ui/SectionHeader'
import Reveal from '@/shared/components/ui/Reveal'
import { servicesData } from '@/data'

const icons = {
  construction: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  architecture: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  interior: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
}

export default function ServicesSection({ services = servicesData }) {
  const safeServices = Array.isArray(services) && services.length >= 3 ? services : servicesData
  const [construction, architecture, interior] = safeServices

  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-950">
      <Container>
        <SectionHeader
          badge="What We Offer"
          heading="Complete Design &"
          headingAccent="Construction Services"
          subheading="From concept to completion — our in-house team of architects, engineers, and builders handles every phase of your project with precision and care."
        />

        {/* Top row: 2 large dark featured cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {[construction, architecture].map((service, i) => (
            <Reveal key={service.id} delay={i * 100}>
              <div className="group relative bg-slate-900 dark:bg-slate-900 border border-white/[0.08] rounded-2xl p-8 overflow-hidden hover:border-gold-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-gold-500/10 min-h-[320px] flex flex-col">
                {/* Radial glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,175,55,0.14) 0%, transparent 70%)' }} />
                {/* Top accent line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-500/0 to-transparent group-hover:via-gold-500/60 transition-all duration-500" />

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-300 mb-6 group-hover:bg-gold-500/20 transition-colors duration-300">
                    {icons[service.id]}
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-gold-300/80">{service.subtitle}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{service.description}</p>
                  <ul className="grid grid-cols-2 gap-2 mb-7">
                    {service.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1 h-1 rounded-full bg-gold-300 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href={service.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200 transition-colors group/link">
                    {service.cta}
                    <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom: Interior as full-width lighter card */}
        <Reveal>
          <div className="group relative bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/[0.06] rounded-2xl p-8 overflow-hidden hover:border-gold-500/20 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-500">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-500/0 to-transparent group-hover:via-gold-500/40 transition-all duration-500" />

            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 flex items-center justify-center text-gold-600 dark:text-gold-300 shrink-0 group-hover:bg-gold-100 dark:group-hover:bg-gold-500/20 transition-colors duration-300">
                  {icons[interior.id]}
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-gold-600/80 dark:text-gold-300/80">{interior.subtitle}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{interior.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-2">{interior.description}</p>
                </div>
              </div>
              <ul className="grid grid-cols-1 gap-2 md:col-span-1">
                {interior.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-gold-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex md:justify-end">
                <Button variant="primary" href={interior.href}>
                  {interior.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
