'use client'
import Container from '@/shared/components/ui/Container'
import SectionHeader from '@/shared/components/ui/SectionHeader'
import Reveal from '@/shared/components/ui/Reveal'
import { processData } from '@/data'

const stepIcons = [
  // Chat/Consultation
  <svg key="chat" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>,
  // Pencil/Design
  <svg key="pencil" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>,
  // Building/Construction
  <svg key="building" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
  </svg>,
  // Key/Handover
  <svg key="key" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>,
]

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      {/* Top/bottom border lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 60%)' }} />

      <Container className="relative">
        <SectionHeader
          badge="How We Work"
          heading="Our Simple"
          headingAccent="4-Step Process"
          subheading="A clear, transparent process — no surprises, no delays, just results."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.3) 20%, rgba(239,68,68,0.3) 80%, transparent)' }} />

          {processData.map((step, i) => (
            <Reveal key={step.step} delay={i * 120}>
              <div className="group relative text-center">
                {/* Step circle */}
                <div className="relative mx-auto w-28 h-28 mb-7">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-red-500/30 transition-colors duration-500" />
                  {/* Inner circle */}
                  <div className="absolute inset-2 rounded-full bg-slate-900 border border-white/[0.08] group-hover:border-red-500/20 flex flex-col items-center justify-center gap-1 transition-colors duration-500">
                    <div className="text-slate-400 group-hover:text-red-400 transition-colors duration-300">
                      {stepIcons[i]}
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-red-500/60 group-hover:text-red-400 transition-colors duration-300">
                      {step.step}
                    </span>
                  </div>
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: '0 0 30px rgba(239,68,68,0.2)' }} />
                </div>

                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-red-100 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[180px] mx-auto">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA strip */}
        <Reveal>
          <div className="mt-16 text-center">
            <p className="text-slate-400 text-sm mb-4">Ready to start your project?</p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Book Free Consultation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
