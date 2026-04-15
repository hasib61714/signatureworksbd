'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function ServiceFaqs({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0)

  if (!faqs.length) return null

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-300">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-black text-navy-900 dark:text-white" style={{ textWrap: 'balance' }}>
          <span className="block">Common</span>
          <span className="block text-gold-600 dark:text-gold-300">questions</span>
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = index === openIndex

          return (
            <div key={faq.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-navy-900/60">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
              >
                <span className="text-sm font-semibold text-navy-900 dark:text-white">{faq.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{faq.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
