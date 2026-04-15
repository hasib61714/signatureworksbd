'use client'
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { ThemeProvider } from '@/shared/context/ThemeContext'
import Navbar from '@/shared/components/layout/Navbar'
import Footer from '@/shared/components/layout/Footer'
import FloatingButtons from '@/shared/components/layout/FloatingButtons'
import { TOTAL_HEADER_HEIGHT_PX } from '@/shared/constants/constants'

function HashScrollHandler() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - TOTAL_HEADER_HEIGHT_PX
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 100)
    return () => clearTimeout(id)
  }, [pathname, searchParams])

  return null
}

function SiteChrome({ children }) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return <>{children}</>
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      <Navbar />
      {children}
      <Footer />
      <FloatingButtons />
    </div>
  )
}

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        <HashScrollHandler />
      </Suspense>
      <Suspense fallback={<>{children}</>}>
        <SiteChrome>{children}</SiteChrome>
      </Suspense>
    </ThemeProvider>
  )
}
