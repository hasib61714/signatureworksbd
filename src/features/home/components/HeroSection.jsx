'use client'
import { useState, useEffect, useCallback } from 'react'
import Container from '@/shared/components/ui/Container'
import Button from '@/shared/components/ui/Button'
import { heroSlidesData } from '@/data'
import { TOTAL_HEADER_HEIGHT_PX, HERO_SLIDE_INTERVAL_MS, HERO_SLIDE_TRANSITION_MS } from '@/shared/constants/constants'

export default function HeroSection() {
  const [current,   setCurrent]   = useState(0)
  const [animating, setAnimating] = useState(false)
  const [paused,    setPaused]    = useState(false)

  const goTo = useCallback((index) => {
    if (animating || index === current) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), HERO_SLIDE_TRANSITION_MS)
  }, [animating, current])

  const next = useCallback(() => goTo((current + 1) % heroSlidesData.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + heroSlidesData.length) % heroSlidesData.length), [current, goTo])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, HERO_SLIDE_INTERVAL_MS)
    return () => clearInterval(t)
  }, [next, paused])

  const slide = heroSlidesData[current]

  return (
    <section
      className="relative overflow-hidden bg-slate-950"
      style={{ marginTop: TOTAL_HEADER_HEIGHT_PX, height: `calc(100dvh - ${TOTAL_HEADER_HEIGHT_PX}px)` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {heroSlidesData.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-linear ${i === current ? 'scale-110' : 'scale-100'}`}
            style={{ backgroundImage: `url(${s.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/45 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
        </div>
      ))}
      <div className="absolute inset-0 bg-grid opacity-20 z-20 pointer-events-none" />

      <div className="absolute inset-0 z-30 flex items-center">
        <Container className="w-full">
          <div className="max-w-[860px] py-10">
            <div key={`badge-${current}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-red-500/15 text-red-400 border border-red-500/25 mb-7 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              {slide.badge}
            </div>
            <h1 key={`h1-${current}`} className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.07] tracking-tight mb-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
              {slide.headline}{' '}
              <span className="bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">{slide.headlineAccent}</span>
            </h1>
            <p key={`sub-${current}`} className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-xl mb-10 animate-fade-up" style={{ animationDelay: '160ms' }}>
              {slide.subheadline}
            </p>
            <div key={`cta-${current}`} className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '240ms' }}>
              <Button variant="primary" size="xl" href={slide.cta1.href} fullWidthOnMobile>
                {slide.cta1.label}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Button>
              <Button variant="secondary" size="xl" href={slide.cta2.href} fullWidthOnMobile>{slide.cta2.label}</Button>
            </div>
          </div>
        </Container>
      </div>

      <button onClick={prev} aria-label="Previous" className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white hover:bg-red-500/20 hover:border-red-500/40 backdrop-blur-sm transition-all duration-200 flex items-center justify-center">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={next} aria-label="Next" className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white hover:bg-red-500/20 hover:border-red-500/40 backdrop-blur-sm transition-all duration-200 flex items-center justify-center">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5">
        {heroSlidesData.map((s, i) => (
          <button key={s.id} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${i === current ? 'w-8 h-2 bg-gradient-to-r from-red-500 to-amber-400 shadow-lg shadow-orange-500/40' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 animate-bounce">
        <span className="text-slate-500 text-[10px] tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </section>
  )
}
