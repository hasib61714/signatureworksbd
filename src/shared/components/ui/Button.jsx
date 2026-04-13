'use client'
import Link from 'next/link'

const variants = {
  primary:
    'bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white hover:from-red-500 hover:via-red-400 hover:to-orange-400 shadow-lg shadow-red-600/20 hover:shadow-orange-500/25',
  secondary:
    'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-slate-200 dark:hover:bg-white/20 hover:border-slate-400 dark:hover:border-white/30',
  outline:
    'border border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-400',
  ghost:
    'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10',
  'outline-white':
    'border border-white/40 text-white hover:bg-white/10 hover:border-white/60',
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
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95 cursor-pointer select-none'
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
