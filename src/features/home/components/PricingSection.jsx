'use client'
import Container from '@/shared/components/ui/Container'
import SectionHeader from '@/shared/components/ui/SectionHeader'
import Reveal from '@/shared/components/ui/Reveal'
import Button from '@/shared/components/ui/Button'
import { pricingData } from '@/data'

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white dark:bg-slate-950">
      <Container>
        <SectionHeader
          badge="Pricing"
          heading="Transparent"
          headingAccent="Pricing"
          subheading="No hidden costs. Every package includes everything listed — and we always discuss custom pricing for larger projects."
        />

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {pricingData.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 100}>
              <div className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                pkg.popular
                  ? 'bg-slate-900 dark:bg-slate-900 border-2 border-red-500/40 shadow-2xl shadow-red-500/10 md:scale-105'
                  : 'bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/[0.07] hover:border-red-200 dark:hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/5'
              }`}>
                {pkg.popular && (
                  <>
                    {/* Top red glow line */}
                    <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r from-red-600 via-orange-400 to-amber-400" />
                    {/* Badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold tracking-widest uppercase shadow-lg shadow-red-500/30">
                      Most Popular
                    </div>
                  </>
                )}

                <h3 className={`text-base font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {pkg.name}
                </h3>

                <div className="mb-1">
                  <span className={`text-4xl font-black ${pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {pkg.price}
                  </span>
                </div>
                <p className={`text-xs mb-5 ${pkg.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                  {pkg.priceNote}
                </p>
                <p className={`text-sm leading-relaxed mb-7 ${pkg.popular ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {pkg.description}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        pkg.popular
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={pkg.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={pkg.popular ? 'primary' : 'outline'}
                  href={pkg.href}
                  className="w-full justify-center"
                >
                  {pkg.cta}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="text-center text-slate-400 dark:text-slate-500 text-sm mt-10">
            Need something custom?{' '}
            <a href="/#contact" className="text-red-500 hover:text-red-400 font-semibold hover:underline transition-colors">
              Get a Custom Quote →
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
