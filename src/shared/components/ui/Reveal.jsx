'use client'
import { useRef, useEffect } from 'react'

/**
 * Reveal — fades/slides children into view when scrolled into viewport.
 * direction: 'up' | 'left' | 'right' | 'scale' | 'fade'
 * delay: transition-delay in ms
 */
export default function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const cls =
    direction === 'left'  ? 'reveal-left'  :
    direction === 'right' ? 'reveal-right' :
    direction === 'scale' ? 'reveal-scale' :
    direction === 'fade'  ? 'reveal-fade'  : 'reveal'

  return (
    <div
      ref={ref}
      className={`${cls} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms`, willChange: 'opacity, transform' } : { willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  )
}
