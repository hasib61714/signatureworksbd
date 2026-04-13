/**
 * SectionLabel — red badge pill used as section category label.
 * Matches Red Data's badge style exactly.
 */
export default function SectionLabel({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 mb-4 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
      {children}
    </span>
  )
}
