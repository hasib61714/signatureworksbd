/**
 * SectionLabel — brand badge for section intros.
 */
export default function SectionLabel({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-gold-50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-500/20 mb-4 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-gold-500 dark:bg-gold-400 animate-pulse" />
      {children}
    </span>
  )
}
