'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function ExpandableText({
  text,
  className = '',
  buttonClassName = '',
  collapsedLines = 2,
  centered = false,
}) {
  const [expanded, setExpanded] = useState(false)
  const [showToggle, setShowToggle] = useState(false)
  const paragraphRef = useRef(null)

  const clampClass = useMemo(() => {
    if (collapsedLines === 1) return 'line-clamp-1'
    if (collapsedLines === 3) return 'line-clamp-3'
    return 'line-clamp-2'
  }, [collapsedLines])

  useEffect(() => {
    const checkOverflow = () => {
      const element = paragraphRef.current
      if (!element) return

      if (expanded) element.classList.add(clampClass)
      const hasOverflow = element.scrollHeight > element.clientHeight + 2
      if (expanded) element.classList.remove(clampClass)

      setShowToggle(hasOverflow)
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [text, clampClass, expanded])

  if (!text) return null

  return (
    <div className={centered ? 'mx-auto max-w-2xl' : ''}>
      <p ref={paragraphRef} className={`${className} ${!expanded ? clampClass : ''}`}>
        {text}
      </p>

      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={`mt-2 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-500 dark:text-gold-300 dark:hover:text-gold-200 ${centered ? 'mx-auto' : ''} ${buttonClassName}`}
        >
          <span>{expanded ? 'Show less' : 'Read more'}</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
