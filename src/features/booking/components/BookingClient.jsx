'use client'
import { useState } from 'react'
import { WHATSAPP_NUMBER } from '@/shared/constants/constants'
import { supabase } from '@/lib/supabase'

// Sat–Thu (0=Sun skip, 5=Fri skip)
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

function getNext14Days() {
  const days = []
  const today = new Date()
  let d = new Date(today)
  d.setDate(d.getDate() + 1) // start from tomorrow

  while (days.length < 14) {
    const dow = d.getDay() // 0=Sun, 5=Fri
    if (dow !== 5) { // skip Friday
      days.push(new Date(d))
    }
    d.setDate(d.getDate() + 1)
  }
  return days
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const MEETING_TYPES = [
  { value: 'in_person', label: 'In-Person', sub: 'Visit our Dhaka office' },
  { value: 'site_visit', label: 'Site Visit', sub: "We come to your location" },
  { value: 'video', label: 'Video Call', sub: 'Google Meet / Zoom' },
]

export default function BookingClient() {
  const days = getNext14Days()
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [meetingType, setMeetingType] = useState('in_person')
  const [form, setForm] = useState({ name: '', phone: '', topic: '' })
  const [status, setStatus] = useState(null) // null | 'submitting' | 'success' | 'error'

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const canSubmit = selectedDay && selectedTime && form.name && form.phone

  const handleSubmit = async e => {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')

    const dateStr = `${selectedDay.getFullYear()}-${String(selectedDay.getMonth() + 1).padStart(2, '0')}-${String(selectedDay.getDate()).padStart(2, '0')}`

    if (supabase) {
      const { error } = await supabase.from('bookings').insert([{
        name: form.name,
        phone: form.phone,
        topic: form.topic || null,
        meeting_type: meetingType,
        date: dateStr,
        time: selectedTime,
        submitted_at: new Date().toISOString(),
      }])
      if (error) {
        console.error('Booking error:', error)
        setStatus('error')
        return
      }
    } else {
      await new Promise(r => setTimeout(r, 800))
    }

    setStatus('success')
  }

  const handleWhatsApp = () => {
    if (!selectedDay || !selectedTime) return
    const dateStr = `${DAY_NAMES[selectedDay.getDay()]} ${selectedDay.getDate()} ${MONTH_NAMES[selectedDay.getMonth()]}`
    const msg = encodeURIComponent(
      `Hello, I'd like to book a consultation.\n\nDate: ${dateStr}\nTime: ${selectedTime}\nType: ${meetingType}\nName: ${form.name}\nPhone: ${form.phone}\n${form.topic ? `Topic: ${form.topic}` : ''}`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  if (status === 'success') {
    const dateStr = `${DAY_NAMES[selectedDay.getDay()]}, ${selectedDay.getDate()} ${MONTH_NAMES[selectedDay.getMonth()]}`
    return (
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-serif text-navy-900 dark:text-white">Booking Confirmed!</h2>
        <p className="text-slate-500 dark:text-slate-400">
          We&apos;ve received your request for <strong className="text-navy-900 dark:text-white">{dateStr} at {selectedTime}</strong>.
          Our team will confirm via WhatsApp within 2 hours.
        </p>
        <button
          onClick={() => { setStatus(null); setSelectedDay(null); setSelectedTime(null); setForm({ name: '', phone: '', topic: '' }) }}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-medium transition-colors mt-2"
        >
          Book another time →
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Meeting type */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-navy-900 dark:text-white font-serif">How would you like to meet?</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {MEETING_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setMeetingType(t.value)}
              className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                meetingType === t.value
                  ? 'bg-gold-500/10 border-gold-500 text-navy-900 dark:text-white'
                  : 'bg-slate-50 dark:bg-navy-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-gold-500/40'
              }`}
            >
              <p className="font-semibold text-sm">{t.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Date picker */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-navy-900 dark:text-white font-serif">Choose a date</h2>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const isSelected = selectedDay && day.toDateString() === selectedDay.toDateString()
            return (
              <button
                key={i}
                onClick={() => { setSelectedDay(day); setSelectedTime(null) }}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-xs transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-b from-gold-600 to-gold-400 text-navy-900 shadow-md shadow-gold-500/20 font-bold'
                    : 'bg-slate-50 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-gold-500/10 hover:text-navy-900 dark:hover:text-white border border-slate-100 dark:border-white/[0.05]'
                }`}
              >
                <span className="opacity-70 mb-0.5">{DAY_NAMES[day.getDay()]}</span>
                <span className="text-base font-bold">{day.getDate()}</span>
                <span className="opacity-70">{MONTH_NAMES[day.getMonth()]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDay && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-navy-900 dark:text-white font-serif">Choose a time</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {TIME_SLOTS.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedTime === t
                    ? 'bg-gold-500/10 border border-gold-500 text-gold-700 dark:text-gold-400'
                    : 'bg-slate-50 dark:bg-navy-800 border border-slate-100 dark:border-white/[0.05] text-slate-600 dark:text-slate-300 hover:border-gold-500/40 hover:bg-gold-500/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contact form */}
      {selectedDay && selectedTime && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-navy-900 dark:text-white font-serif">Your details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800 text-navy-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">Phone *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+880 1XXX-XXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800 text-navy-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">What would you like to discuss? (optional)</label>
              <textarea
                name="topic"
                value={form.topic}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. 2,000 sqft apartment renovation in Gulshan..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800 text-navy-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors text-sm resize-none"
              />
            </div>

            {/* Booking summary */}
            <div className="bg-slate-50 dark:bg-navy-800 rounded-xl px-5 py-4 text-sm">
              <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Booking Summary</p>
              <div className="space-y-1 text-navy-900 dark:text-white">
                <p><span className="text-slate-400 w-20 inline-block">Date:</span> {DAY_NAMES[selectedDay.getDay()]}, {selectedDay.getDate()} {MONTH_NAMES[selectedDay.getMonth()]}</p>
                <p><span className="text-slate-400 w-20 inline-block">Time:</span> {selectedTime}</p>
                <p><span className="text-slate-400 w-20 inline-block">Type:</span> {MEETING_TYPES.find(t => t.value === meetingType)?.label}</p>
              </div>
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm text-center">Something went wrong. Please try via WhatsApp below.</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={!canSubmit || status === 'submitting'}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 text-navy-900 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-300 active:scale-95"
              >
                {status === 'submitting' ? 'Confirming...' : 'Confirm Booking'}
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={!form.name || !form.phone}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1ebe5d] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
