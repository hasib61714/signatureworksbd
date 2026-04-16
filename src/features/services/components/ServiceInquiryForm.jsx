'use client'

import { useState } from 'react'
import { ArrowRight, MessageCircle, Send } from 'lucide-react'
import emailjs from '@emailjs/browser'
import useSiteContactSettings from '@/shared/hooks/useSiteContactSettings'
import { supabase } from '@/lib/supabase'

export default function ServiceInquiryForm({ serviceName }) {
  const [form, setForm] = useState({ name: '', phone: '', location: '', message: '' })
  const [status, setStatus] = useState('idle')
  const { whatsappNumber } = useSiteContactSettings()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    let savedToSupabase = false
    const composedMessage = [
      form.message || 'No message',
      form.location ? `Project location: ${form.location}` : null,
    ].filter(Boolean).join('\n\n')

    if (supabase) {
      const { error } = await supabase.from('contact_submissions').insert([{
        name: form.name,
        phone: form.phone,
        email: null,
        service: serviceName,
        budget: null,
        message: composedMessage,
      }])

      if (error) {
        console.error('Service inquiry save error:', error)
      } else {
        savedToSupabase = true
      }
    }

    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: form.name,
            from_phone: form.phone,
            from_email: 'Not provided',
            service_type: serviceName,
            budget_range: form.location || 'Not specified',
            message: composedMessage,
          },
          publicKey,
        )
      } catch (error) {
        console.error('Service inquiry error:', error)
        if (!savedToSupabase) {
          setStatus('error')
          return
        }
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 700))
    }

    setStatus('sent')
    setForm({ name: '', phone: '', location: '', message: '' })
  }

  const message = encodeURIComponent(
    `Hello, I want to discuss ${serviceName}. Name: ${form.name || 'Not given'}, Phone: ${form.phone || 'Not given'}, Location: ${form.location || 'Not given'}, Message: ${form.message || 'Need details.'}`,
  )

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy-900 placeholder-slate-400 focus:border-gold-500 focus:outline-none dark:border-white/10 dark:bg-navy-900/60 dark:text-white'

  return (
    <section className="rounded-3xl border border-navy-900 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-6 text-white shadow-xl shadow-navy-950/15">
      <h2 className="text-2xl font-black" style={{ textWrap: 'balance' }}>
        <span className="block">Start your</span>
        <span className="block text-gold-300">enquiry</span>
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Share your project details and get a response tailored to {serviceName.toLowerCase()} work.
      </p>

      {status === 'sent' ? (
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          Inquiry sent successfully. Our team will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone number" className={inputClass} />
          </div>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Project location" className={inputClass} />
          <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us about your project..." className={`${inputClass} resize-none`} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={status === 'sending'} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-300 px-5 py-3 text-sm font-semibold text-navy-950 transition hover:opacity-90 disabled:opacity-60">
              <Send className="h-4 w-4" />
              <span>{status === 'sending' ? 'Sending...' : 'Send inquiry'}</span>
            </button>
            <a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-slate-400">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Best for quick service-specific discussions</span>
          </div>
        </form>
      )}
    </section>
  )
}
