'use client'
import Image from 'next/image'
import Container from '@/shared/components/ui/Container'
import Reveal from '@/shared/components/ui/Reveal'
import Button from '@/shared/components/ui/Button'
import { aboutData } from '@/data'

export default function AboutSection({ about = aboutData }) {
  const safeAbout = about && typeof about === 'object' ? about : aboutData
  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-950">
      <Container>
        {/* Story + Mission */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">
          <Reveal direction="left">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-gold-50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-500/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 dark:bg-gold-300" />
                About Us
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6" style={{ textWrap: 'balance' }}>
                <span className="block">Building Bangladesh&apos;s</span>
                <span className="block bg-gradient-to-r from-gold-500 via-amber-400 to-gold-300 bg-clip-text text-transparent">
                  Finest Spaces
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5">{safeAbout.story}</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                <strong className="text-slate-900 dark:text-white font-semibold">Our Mission: </strong>
                {safeAbout.mission}
              </p>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {(safeAbout.values || []).map(v => (
                  <span key={v} className="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                    {v}
                  </span>
                ))}
              </div>
              <Button variant="primary" href="/#contact">
                Work With Us
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </div>
          </Reveal>

          {/* Image collage */}
          <Reveal direction="right">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square">
                  <Image src="/images/stock/hero-home.jpg" alt="Project" fill sizes="(max-width: 1024px) 50vw, 25vw" className="rounded-2xl object-cover" />
                </div>
                <div className="relative aspect-square mt-8">
                  <Image src="/images/stock/hero-interior.jpg" alt="Interior" fill sizes="(max-width: 1024px) 50vw, 25vw" className="rounded-2xl object-cover" />
                </div>
                <div className="relative aspect-square -mt-8">
                  <Image src="/images/stock/portfolio-office.jpg" alt="Office" fill sizes="(max-width: 1024px) 50vw, 25vw" className="rounded-2xl object-cover" />
                </div>
                <div className="relative aspect-square">
                  <Image src="/images/stock/hero-construction.jpg" alt="Building" fill sizes="(max-width: 1024px) 50vw, 25vw" className="rounded-2xl object-cover" />
                </div>
              </div>
              {/* Experience badge */}
              <div className="absolute -bottom-5 -left-5 bg-gradient-to-br from-navy-900 via-navy-800 to-gold-500 rounded-2xl p-5 shadow-2xl shadow-navy-950/30">
                <p className="text-white text-3xl font-black leading-none">8+</p>
                <p className="text-amber-100 text-sm font-medium mt-1">Years of<br />Excellence</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-12">
            <Reveal>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Meet the{' '}
                <span className="bg-gradient-to-r from-gold-500 via-amber-400 to-gold-300 bg-clip-text text-transparent">
                  Team
                </span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">
                The experts behind every signature project
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(safeAbout.team || []).map((member, i) => (
              <Reveal key={member.name} delay={i * 100}>
                <div className="group text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/[0.06] hover:border-gold-200 dark:hover:border-gold-500/20 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy-900 via-navy-700 to-gold-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-navy-950/20 group-hover:scale-110 group-hover:shadow-gold-500/30 transition-all duration-300">
                    <span className="text-white font-black text-sm">{member.avatar}</span>
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-semibold text-sm">{member.name}</h4>
                  <p className="text-gold-600 dark:text-gold-300 text-xs font-medium mt-0.5">{member.role}</p>
                  <p className="text-slate-500 dark:text-slate-500 text-xs mt-2.5 leading-relaxed">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
