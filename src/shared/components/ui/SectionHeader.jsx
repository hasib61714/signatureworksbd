import Reveal from './Reveal'
import ExpandableText from './ExpandableText'

export default function SectionHeader({ badge, heading, headingAccent, subheading, center = true }) {
  return (
    <Reveal className={`mb-12 ${center ? 'text-center' : ''}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-gold-50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-500/20 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 dark:bg-gold-400" />
          {badge}
        </span>
      )}
      <h2
        className={`line-clamp-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 dark:text-white leading-tight ${center ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}
        style={{ textWrap: 'balance' }}
      >
        <span className="block">{heading}</span>
        {headingAccent && (
          <span className="mt-1 block bg-gradient-to-r from-gold-500 via-amber-300 to-navy-500 bg-clip-text text-transparent">
            {headingAccent}
          </span>
        )}
      </h2>
      {subheading && (
        <ExpandableText
          text={subheading}
          centered={center}
          className={`mt-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed ${center ? 'mx-auto' : ''}`}
        />
      )}
    </Reveal>
  )
}
