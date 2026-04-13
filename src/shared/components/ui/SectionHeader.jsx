import Reveal from './Reveal'

/**
 * SectionHeader — unified section heading used across all sections.
 * badge: small pill label above heading
 * heading: main text (plain)
 * headingAccent: gradient-colored tail of heading
 * subheading: supporting paragraph
 * center: boolean (default true)
 */
export default function SectionHeader({ badge, heading, headingAccent, subheading, center = true }) {
  return (
    <Reveal className={`mb-12 ${center ? 'text-center' : ''}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
          {badge}
        </span>
      )}
      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight ${center ? 'mx-auto' : ''}`}>
        {heading}{' '}
        {headingAccent && (
          <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
            {headingAccent}
          </span>
        )}
      </h2>
      {subheading && (
        <p className={`mt-4 text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''}`}>
          {subheading}
        </p>
      )}
    </Reveal>
  )
}
