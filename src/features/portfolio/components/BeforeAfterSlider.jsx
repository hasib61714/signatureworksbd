'use client'
import { useState, useRef, useCallback } from 'react'

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeAlt = 'Before', afterAlt = 'After' }) {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef(null)

  const getPosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return 50
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    return (x / rect.width) * 100
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!dragging) return
    setPosition(getPosition(e.clientX))
  }, [dragging, getPosition])

  const onTouchMove = useCallback((e) => {
    setPosition(getPosition(e.touches[0].clientX))
  }, [getPosition])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-col-resize select-none"
      onMouseMove={onMouseMove}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={onTouchMove}
      onTouchEnd={() => setDragging(false)}
    >
      {/* After image (full) */}
      <img src={afterImage} alt={afterAlt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Before image (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={beforeImage} alt={beforeAlt} className="absolute inset-0 h-full object-cover" style={{ width: `${100 / (position / 100)}%`, maxWidth: 'none' }} draggable={false} />
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
        {/* Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center cursor-col-resize"
          onMouseDown={(e) => { e.preventDefault(); setDragging(true) }}
          onTouchStart={() => setDragging(true)}
        >
          <svg className="w-5 h-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">Before</div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">After</div>

      {/* Percentage */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-navy-900/70 backdrop-blur-sm text-gold-400 text-xs font-semibold">
        {Math.round(position)}%
      </div>
    </div>
  )
}
