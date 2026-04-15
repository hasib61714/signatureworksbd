'use client'
import { useState } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { WHATSAPP_NUMBER } from '@/shared/constants/constants'

// ── BDT cost per sqft by type × grade (2024 Dhaka rates) ──────────────────
const RATES = {
  residential: { standard: { min: 1800, max: 2400 }, premium: { min: 2800, max: 3800 }, luxury: { min: 4500, max: 7000 } },
  commercial:  { standard: { min: 2000, max: 2800 }, premium: { min: 3200, max: 4500 }, luxury: { min: 5000, max: 8000 } },
  interior:    { standard: { min:  600, max:  900 }, premium: { min: 1200, max: 2000 }, luxury: { min: 2500, max: 4500 } },
  renovation:  { standard: { min:  800, max: 1200 }, premium: { min: 1500, max: 2500 }, luxury: { min: 3000, max: 5000 } },
}

// Location multipliers
const LOCATION = {
  dhaka_prime:   1.15,  // Gulshan, Banani, Baridhara
  dhaka_city:    1.00,  // Dhanmondi, Mirpur, Uttara, Bashundhara
  dhaka_outskirt: 0.88, // Keraniganj, Savar, Gazipur
  outside_dhaka:  0.80, // Other districts
}

// Floor count multipliers (structural complexity)
const FLOOR = {
  '1': 1.00,
  '2': 1.02,
  '3-4': 1.05,
  '5-6': 1.10,
  '7+': 1.18,
}

function formatBDT(amount) {
  if (amount >= 10000000) return `৳${(amount / 10000000).toFixed(2)} Crore`
  if (amount >= 100000) return `৳${(amount / 100000).toFixed(1)} Lakh`
  return `৳${amount.toLocaleString('en-BD')}`
}

const STEPS = [
  {
    id: 'type',
    question: 'What type of project?',
    options: [
      { value: 'residential', label: 'Residential', sub: 'House / apartment construction' },
      { value: 'commercial',  label: 'Commercial',  sub: 'Office, shop, plaza' },
      { value: 'interior',    label: 'Interior',    sub: 'Fit-out for existing space' },
      { value: 'renovation',  label: 'Renovation',  sub: 'Partial remodel / upgrade' },
    ],
  },
  {
    id: 'grade',
    question: 'What quality grade?',
    options: [
      { value: 'standard', label: 'Standard',  sub: 'Functional finish, local materials' },
      { value: 'premium',  label: 'Premium',   sub: 'Quality finish, branded fixtures' },
      { value: 'luxury',   label: 'Luxury',    sub: 'High-end imports, custom work' },
    ],
  },
  {
    id: 'location',
    question: 'Where is the project?',
    options: [
      { value: 'dhaka_prime',    label: 'Dhaka Prime',      sub: 'Gulshan, Banani, Baridhara' },
      { value: 'dhaka_city',     label: 'Dhaka City',       sub: 'Dhanmondi, Mirpur, Uttara, Bashundhara' },
      { value: 'dhaka_outskirt', label: 'Dhaka Outskirts',  sub: 'Savar, Keraniganj, Gazipur' },
      { value: 'outside_dhaka',  label: 'Outside Dhaka',    sub: 'Other districts' },
    ],
  },
  {
    id: 'floors',
    question: 'How many floors?',
    options: [
      { value: '1',   label: '1 storey',    sub: '' },
      { value: '2',   label: '2 storeys',   sub: '' },
      { value: '3-4', label: '3–4 storeys', sub: '' },
      { value: '5-6', label: '5–6 storeys', sub: '' },
      { value: '7+',  label: '7+ storeys',  sub: '' },
    ],
  },
]

function OptionButton({ option, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(option.value)}
      className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
        selected
          ? 'bg-gold-500/10 border-gold-500 text-navy-900 dark:text-white shadow-md shadow-gold-500/10'
          : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-gold-500/40 hover:bg-gold-500/5'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">{option.label}</p>
          {option.sub && <p className="text-xs text-slate-400 mt-0.5">{option.sub}</p>}
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          selected ? 'border-gold-500 bg-gold-500' : 'border-slate-300 dark:border-white/20'
        }`}>
          {selected && <svg className="w-3 h-3 text-navy-900" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-7z"/></svg>}
        </div>
      </div>
    </button>
  )
}

export default function CostCalculatorClient() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({ type: '', grade: '', location: '', floors: '' })
  const [area, setArea] = useState('')
  const [showResult, setShowResult] = useState(false)

  const showFloors = answers.type === 'residential' || answers.type === 'commercial'

  const effectiveSteps = showFloors ? STEPS : STEPS.filter(s => s.id !== 'floors')
  const totalSteps = effectiveSteps.length + 1 // +1 for area input
  const effectiveStep = effectiveSteps[currentStep]

  const select = (value) => {
    const key = effectiveStep.id
    const next = { ...answers, [key]: value }
    setAnswers(next)

    if (currentStep < effectiveSteps.length - 1) {
      setCurrentStep(s => s + 1)
    }
    // Last option step → show area input
  }

  const allOptionsSelected = effectiveSteps.every(s => answers[s.id])

  const canShowResult = allOptionsSelected && area && Number(area) > 0

  const calculate = () => {
    if (!canShowResult) return
    setShowResult(true)
  }

  const reset = () => {
    setAnswers({ type: '', grade: '', location: '', floors: '' })
    setArea('')
    setCurrentStep(0)
    setShowResult(false)
  }

  if (showResult) {
    const rate = RATES[answers.type]?.[answers.grade]
    const locMult = LOCATION[answers.location] || 1
    const floorMult = answers.floors ? (FLOOR[answers.floors] || 1) : 1
    const sqft = Number(area)

    const low  = Math.round(rate.min * locMult * floorMult * sqft / 10000) * 10000
    const high = Math.round(rate.max * locMult * floorMult * sqft / 10000) * 10000
    const mid  = Math.round((low + high) / 2 / 10000) * 10000

    const waMsg = encodeURIComponent(
      `Hello, I used the cost calculator on your website.\n\nProject: ${answers.type} (${answers.grade} grade)\nLocation: ${answers.location.replace(/_/g,' ')}\nArea: ${sqft} sqft\nEstimate: ${formatBDT(low)} – ${formatBDT(high)}\n\nCan we discuss a proper quote?`
    )

    return (
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">Estimated Cost Range</p>
          <p className="text-4xl sm:text-5xl font-bold text-navy-900 dark:text-white font-serif">
            {formatBDT(low)} <span className="text-slate-400 text-2xl font-normal">–</span> {formatBDT(high)}
          </p>
          <p className="text-slate-400 text-sm mt-2">Midpoint estimate: <span className="text-gold-500 font-semibold">{formatBDT(mid)}</span></p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Type',     value: answers.type },
            { label: 'Grade',    value: answers.grade },
            { label: 'Area',     value: `${Number(area).toLocaleString()} sqft` },
            { label: 'Location', value: answers.location.replace(/_/g, ' ') },
          ].map(item => (
            <div key={item.label} className="bg-slate-50 dark:bg-navy-800 rounded-xl px-4 py-3 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider">{item.label}</p>
              <p className="text-navy-900 dark:text-white font-semibold text-sm mt-1 capitalize">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
          <strong>Important:</strong> This is a ballpark estimate only. Actual costs depend on specific design, soil conditions, contractor rates, and material choices. Always get a detailed quote before committing.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1ebe5d] transition-colors active:scale-95"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Get a Proper Quote
          </a>
          <Link href="/#contact" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-navy-900 dark:bg-white/10 text-white border border-white/20 font-semibold text-sm hover:bg-navy-800 dark:hover:bg-white/20 transition-colors">
            Book Consultation
          </Link>
        </div>

        <button onClick={reset} className="inline-flex w-full items-center justify-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-medium transition-colors py-2">
          <RotateCcw className="h-4 w-4" />
          <span>Start over</span>
        </button>
      </div>
    )
  }

  // Progress bar
  const answeredCount = effectiveSteps.filter(s => answers[s.id]).length
  const progressPct = Math.round((answeredCount / (effectiveSteps.length + 1)) * 100)

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/[0.08] rounded-2xl overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-slate-100 dark:bg-navy-800">
        <div
          className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="p-8 space-y-6">
        {/* Step counter */}
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Step {Math.min(answeredCount + 1, totalSteps)} of {totalSteps}
        </p>

        {/* Option steps */}
        {effectiveStep && !allOptionsSelected && (
          <div key={effectiveStep.id} className="space-y-3">
            <h2 className="text-xl font-bold text-navy-900 dark:text-white font-serif">{effectiveStep.question}</h2>
            <div className="space-y-2.5">
              {effectiveStep.options.map(opt => (
                <OptionButton
                  key={opt.value}
                  option={opt}
                  selected={answers[effectiveStep.id] === opt.value}
                  onClick={select}
                />
              ))}
            </div>
          </div>
        )}

        {/* Area input — show after all options answered */}
        {allOptionsSelected && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-navy-900 dark:text-white font-serif">What is the total built-up area?</h2>
            <div className="relative">
              <input
                type="number"
                min="100"
                max="100000"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800 text-navy-900 dark:text-white placeholder-slate-400 text-lg font-semibold focus:outline-none focus:border-gold-500 transition-colors pr-20"
                autoFocus
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">sqft</span>
            </div>
            <p className="text-slate-400 text-xs">Not sure of exact sqft? Multiply length × width of each floor in feet.</p>
            <button
              onClick={calculate}
              disabled={!canShowResult}
              className="inline-flex w-full items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 text-navy-900 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-300 active:scale-95"
            >
              <span>Calculate Estimate</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Already-answered summary chips */}
        {answeredCount > 0 && !allOptionsSelected && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            {effectiveSteps.slice(0, currentStep).map(s => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(effectiveSteps.indexOf(s))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-400 text-xs font-medium hover:bg-gold-500/20 transition-colors capitalize"
              >
                {s.id}: {answers[s.id].replace(/_/g, ' ')}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 013.182 3.182L7.5 21H3v-4.5L16.862 4.487z" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
