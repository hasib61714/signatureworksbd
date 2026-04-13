'use client'
import { useState } from 'react'
import Container from '@/shared/components/ui/Container'
import Button from '@/shared/components/ui/Button'
import Reveal from '@/shared/components/ui/Reveal'
import { PHONE_NUMBER, WHATSAPP_NUMBER, EMAIL } from '@/shared/constants/constants'
import { supabase } from '@/lib/supabase'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', budget: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')

    if (supabase) {
      const { error } = await supabase.from('contact_submissions').insert([{
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        service: form.service || null,
        budget: form.budget || null,
        message: form.message || null,
        submitted_at: new Date().toISOString(),
      }])
      if (error) {
        console.error('Supabase error:', error)
        setStatus('error')
        return
      }
    } else {
      await new Promise(r => setTimeout(r, 800))
    }

    setStatus('sent')
    setForm({ name: '', phone: '', email: '', service: '', budget: '', message: '' })
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-slate-800 transition-all duration-200 text-sm'

  const contactLinks = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      label: 'Location',
      value: 'Dhaka Division, Bangladesh',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
      label: 'Phone',
      value: PHONE_NUMBER,
      href: `tel:${PHONE_NUMBER}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      label: 'WhatsApp',
      value: 'Chat directly',
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      iconColor: 'text-[#25D366]',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      label: 'Email',
      value: EMAIL,
      href: `mailto:${EMAIL}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Hours',
      value: 'Sat–Thu 9am–7pm · Fri by Appt',
    },
  ]

  return (
    <section id="contact" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 60%)' }} />

      <Container className="relative">
        {/* Section header */}
        <div className="text-center mb-14">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-red-500/10 text-red-400 border border-red-500/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Contact Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Start Your{' '}
              <span className="bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                Dream Project
              </span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-lg mx-auto">
              Book a free consultation. Tell us your vision and we&apos;ll show you what&apos;s possible.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <Reveal direction="left" className="lg:col-span-2">
            <div className="space-y-5">
              {contactLinks.map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-slate-800/60 border border-white/10 flex items-center justify-center shrink-0 ${item.iconColor || 'text-red-400'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="text-slate-200 text-sm hover:text-red-300 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-slate-200 text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] h-48 mt-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117964.93538086804!2d90.34960495!3d23.7808875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1680000000000!5m2!1sen!2sbd"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal direction="right" className="lg:col-span-3">
            <div className="bg-slate-900/60 border border-white/[0.07] rounded-3xl p-8 relative overflow-hidden">
              {/* Top red accent line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

              {status === 'sent' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-slate-400 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus(null)} className="mt-6 text-red-400 text-sm hover:text-red-300 font-medium transition-colors">
                    Send another message →
                  </button>
                </div>
              ) : status === 'error' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">Something went wrong</h3>
                  <p className="text-slate-400 text-sm">Please try again or reach us via WhatsApp.</p>
                  <button onClick={() => setStatus(null)} className="mt-6 text-red-400 text-sm hover:text-red-300 font-medium transition-colors">
                    Try again →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold tracking-wide uppercase mb-2">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold tracking-wide uppercase mb-2">Phone *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+880 1XXX-XXXXXX" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold tracking-wide uppercase mb-2">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputCls} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold tracking-wide uppercase mb-2">Service Required</label>
                      <select name="service" value={form.service} onChange={handleChange} className={inputCls}>
                        <option value="">Select a service</option>
                        <option>Construction</option>
                        <option>Architectural Design</option>
                        <option>Interior Design</option>
                        <option>Renovation</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold tracking-wide uppercase mb-2">Budget Range</label>
                      <select name="budget" value={form.budget} onChange={handleChange} className={inputCls}>
                        <option value="">Select budget</option>
                        <option>Under ৳1 Lakh</option>
                        <option>৳1–5 Lakh</option>
                        <option>৳5–20 Lakh</option>
                        <option>৳20–50 Lakh</option>
                        <option>৳50 Lakh+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold tracking-wide uppercase mb-2">Project Description</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us about your project..." className={inputCls + ' resize-none'} />
                  </div>
                  <Button variant="primary" size="lg" className="w-full justify-center" onClick={() => {}}>
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                    {status !== 'sending' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    )}
                  </Button>
                  <p className="text-center text-slate-500 text-xs">
                    Or reach us via{' '}
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-[#25D366] hover:underline font-medium">
                      WhatsApp
                    </a>
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
