'use client'
import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, ChevronsDown, MessageCircle, PhoneCall } from 'lucide-react'
import Container from '@/shared/components/ui/Container'
import Button from '@/shared/components/ui/Button'
import ExpandableText from '@/shared/components/ui/ExpandableText'
import { heroSlidesData } from '@/data'
import { TOTAL_HEADER_HEIGHT_PX, HERO_SLIDE_INTERVAL_MS, HERO_SLIDE_TRANSITION_MS } from '@/shared/constants/constants'

const studioSignals = [
  { value: 'Design + Build', label: 'One team from idea to delivery' },
  { value: 'On-site updates', label: 'Milestones shared clearly' },
  { value: 'Budget aware', label: 'Premium feel with control' },
]

const projectChecklist = [
  'Space planning that fits daily routines',
  'Material choices matched to your budget',
  'Execution support from start to handover',
]

export default function HeroSection({ slides = heroSlidesData }) {
  const safeSlides = Array.isArray(slides) && slides.length > 0 ? slides : heroSlidesData
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((index) => {
    if (animating || index === current) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), HERO_SLIDE_TRANSITION_MS)
  }, [animating, current])

  const next = useCallback(() => goTo((current + 1) % safeSlides.length), [current, goTo, safeSlides.length])
  const prev = useCallback(() => goTo((current - 1 + safeSlides.length) % safeSlides.length), [current, goTo, safeSlides.length])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, HERO_SLIDE_INTERVAL_MS)
    return () => clearInterval(t)
  }, [next, paused])

  const slide = safeSlides[current]

  return (
    <section
      className="relative overflow-hidden bg-slate-950"
      style={{ marginTop: TOTAL_HEADER_HEIGHT_PX, minHeight: `calc(100dvh - ${TOTAL_HEADER_HEIGHT_PX}px)` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {heroSlidesData.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-linear ${i === current ? 'scale-105' : 'scale-100'}`}
            style={{ backgroundImage: `url(${s.image})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.8)_38%,rgba(15,23,42,0.55)_62%,rgba(15,23,42,0.35)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.18),transparent_28%)]" />
        </div>
      ))}

      <div className="absolute inset-0 z-20 bg-grid opacity-15 pointer-events-none" />

      <Container className="relative z-30 flex min-h-[inherit] items-center py-10 lg:py-14">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <div
              key={`badge-${current}`}
              className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200 animate-fade-up"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              {slide.badge}
            </div>

            <h1
              key={`h1-${current}`}
              className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-white animate-fade-up sm:text-5xl lg:text-7xl"
              style={{ animationDelay: '80ms', textWrap: 'balance' }}
            >
              <span className="block">{slide.headline}</span>
              <span className="mt-1 block bg-gradient-to-r from-gold-200 via-amber-200 to-white bg-clip-text text-transparent">
                {slide.headlineAccent}
              </span>
            </h1>

            <div
              key={`sub-${current}`}
              className="animate-fade-up"
              style={{ animationDelay: '160ms' }}
            >
              <ExpandableText
                text={slide.subheadline}
                className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg"
              />
            </div>

            <div
              key={`cta-${current}`}
              className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-up"
              style={{ animationDelay: '240ms' }}
            >
              <Button variant="primary" size="xl" href={slide.cta1.href} fullWidthOnMobile>
                {slide.cta1.icon === 'phone' && <PhoneCall className="h-4 w-4" />}
                {slide.cta1.icon === 'message-circle' && <MessageCircle className="h-4 w-4" />}
                <span>{slide.cta1.label}</span>
                {slide.cta1.icon === 'arrow-right' && <ArrowRight className="h-4 w-4" />}
              </Button>
              <Button variant="outline-white" size="xl" href={slide.cta2.href} fullWidthOnMobile>
                <span>{slide.cta2.label}</span>
                {slide.cta2.icon === 'arrow-right' && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {studioSignals.map((item) => (
                <div key={item.value} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="text-sm font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-3 py-2">
                {safeSlides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`rounded-full transition-all duration-500 ${i === current ? 'h-2 w-8 bg-gradient-to-r from-gold-500 to-amber-300' : 'h-2 w-2 bg-white/30 hover:bg-white/60'}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-6">
            <div className="rounded-[30px] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div
                className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/40"
              >
                <div
                  className="h-52 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="grid gap-4 p-4 sm:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">Studio snapshot</p>
                    <h3 className="mt-2 text-xl font-bold text-white">Planned to feel bespoke, not borrowed.</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      A cleaner split layout, editorial cards, and project-led storytelling make the homepage more original and brand-specific.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-sm font-semibold text-white">Project checklist</p>
                    <ul className="mt-3 space-y-2">
                      {projectChecklist.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs leading-5 text-slate-300">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 animate-bounce">
        <ChevronsDown className="h-4 w-4 text-slate-400" />
      </div>
    </section>
  )
}
