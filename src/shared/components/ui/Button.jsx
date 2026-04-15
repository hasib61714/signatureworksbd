'use client'
import Link from 'next/link'

const variants = {
  primary:
    'bg-gradient-to-r from-gold-500 via-amber-400 to-gold-300 text-navy-950 hover:from-gold-400 hover:via-amber-300 hover:to-gold-200 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30',
  secondary:
    'bg-navy-900 dark:bg-navy-800 text-white border border-navy-700 dark:border-white/10 hover:bg-navy-800 dark:hover:bg-navy-700',
  outline:
    'border border-gold-500/50 text-gold-700 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-500/10 hover:border-gold-400',
  ghost:
    'text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white hover:bg-navy-50 dark:hover:bg-white/10',
  'outline-white':
    'border border-white/40 text-white hover:bg-white/10 hover:border-gold-300/60',
}

const sizes = {
  sm:  'px-4 py-2 text-sm',
  md:  'px-6 py-3 text-sm',
  lg:  'px-8 py-4 text-base',
  xl:  'px-10 py-4 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  fullWidthOnMobile = false,
  className = '',
  onClick,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 active:scale-95 cursor-pointer select-none'
  const mobileClass = fullWidthOnMobile ? 'w-full sm:w-auto' : ''
  const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size]} ${mobileClass} ${className}`

  if (href) {
    if (href.startsWith('/') || href.startsWith('#')) {
      return <Link href={href} className={classes} {...props}>{children}</Link>
    }
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  )
}
