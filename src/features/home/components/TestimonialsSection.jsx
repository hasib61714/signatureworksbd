'use client'
import Container from '@/shared/components/ui/Container'
import SectionHeader from '@/shared/components/ui/SectionHeader'
import Reveal from '@/shared/components/ui/Reveal'
import { testimonialsData } from '@/data'

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection({ testimonials = testimonialsData }) {
  const safeTestimonials = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : testimonialsData

  return (
    <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-900">
      <Container>
        <SectionHeader
          badge="Testimonials"
          heading="What Our"
          headingAccent="Clients Say"
          subheading="Don't take our word for it — hear from the people we've built for."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {safeTestimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <div className="group bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/[0.06] rounded-2xl p-7 hover:border-gold-200 dark:hover:border-gold-500/20 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                {/* Quote mark */}
                <div className="absolute top-4 right-6 text-6xl font-serif leading-none text-slate-100 dark:text-white/[0.04] select-none pointer-events-none">
                  &ldquo;
                </div>

                <Stars count={t.rating} />

                <blockquote className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-4 mb-6 flex-1 relative z-10">
                  &ldquo;{t.review}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-900 via-navy-700 to-gold-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trust indicators */}
        <Reveal>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400 dark:text-slate-500">
            {[
              { val: '150+', label: 'Happy Clients' },
              { val: '5.0', label: 'Average Rating' },
              { val: '98%', label: 'Satisfaction Rate' },
              { val: '8+', label: 'Years Trusted' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{item.val}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
