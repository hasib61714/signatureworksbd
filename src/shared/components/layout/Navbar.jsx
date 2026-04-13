'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Container from '@/shared/components/ui/Container'
import { useTheme } from '@/shared/context/ThemeContext'
import { PHONE_NUMBER, WHATSAPP_NUMBER, EMAIL, FACEBOOK_URL, CONTACT_STRIP_HEIGHT_PX } from '@/shared/constants/constants'

const SERVICE_ITEMS = [
  { label: 'Architectural Design', desc: 'Concept to permit-ready drawings', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/#services' },
  { label: 'Construction',         desc: 'Full turnkey build management',      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', href: '/#services' },
  { label: 'Interior Design',      desc: 'Residential & commercial spaces',    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', href: '/#services' },
  { label: 'Renovation',           desc: 'Remodel & upgrade existing spaces',  icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', href: '/#services' },
  { label: 'Cost Calculator',      desc: 'Instant project estimate tool',      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', href: '/calculator' },
  { label: 'Book Consultation',    desc: 'Free 30-min expert session',         icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', href: '/book' },
]

const linkCls = (active) =>
  `relative px-2.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all duration-200 whitespace-nowrap ${
    active
      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.07]'
  }`

const mobileLinkCls = (active) =>
  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
    active
      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.07]'
  }`

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 110 10A5 5 0 0112 7z" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}

export default function Navbar() {
  const { dark, toggle: toggleTheme } = useTheme()
  const pathname = usePathname()
  const dropdownRef = useRef(null)

  const [menuOpen,           setMenuOpen]           = useState(false)
  const [servicesOpen,       setServicesOpen]       = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [scrolled,           setScrolled]           = useState(false)
  const [stripHidden,        setStripHidden]        = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => { setMenuOpen(false); setServicesOpen(false); setMobileServicesOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastScrollY.current
      lastScrollY.current = y
      setScrolled(y > 8)
      if (goingDown && y > 120) setStripHidden(true)
      else if (!goingDown) setStripHidden(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setServicesOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      {/* ── Contact Strip ──────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ease-in-out ${
          stripHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="bg-slate-900 dark:bg-black border-b border-white/[0.06]" style={{ height: CONTACT_STRIP_HEIGHT_PX }}>
          <Container>
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-4">
                <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-1.5 text-slate-300 hover:text-white text-[11px] transition-colors">
                  <svg className="w-3 h-3 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="hidden sm:inline">{PHONE_NUMBER}</span>
                  <span className="sm:hidden">Call</span>
                </a>
                <span className="hidden md:block w-px h-3 bg-white/20" />
                <a href={`mailto:${EMAIL}`} className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white text-[11px] transition-colors">
                  <svg className="w-3 h-3 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  {EMAIL}
                </a>
                <span className="hidden lg:block w-px h-3 bg-white/20" />
                <span className="hidden lg:flex items-center gap-1.5 text-slate-500 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Dhaka, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-1">
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-[#25D366] hover:bg-white/10 transition-all duration-200">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* ── Main Nav ───────────────────────────────────────────────── */}
      <header
        style={{ top: stripHidden ? 0 : CONTACT_STRIP_HEIGHT_PX }}
        className={`fixed left-0 right-0 z-50 transition-[background-color,box-shadow,border-color,top] duration-200 border-b ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl dark:bg-slate-900/95 shadow-lg shadow-black/5 dark:shadow-black/60 border-slate-200/80 dark:border-white/10'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/[0.08]'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-14 gap-2">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-md shadow-red-600/30">
                <span className="text-white font-black text-sm">SW</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-slate-900 dark:text-white text-sm leading-none">Signature Works BD</span>
                <span className="block text-[10px] text-slate-400 leading-none mt-0.5">Design & Construction</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
              <Link href="/" className={linkCls(pathname === '/')}>Home</Link>

              {/* Services Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setServicesOpen(v => !v)}
                  className={`${linkCls(servicesOpen)} flex items-center gap-1`}
                >
                  Services
                  <svg className={`w-3 h-3 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[500px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.09] shadow-2xl shadow-black/10 dark:shadow-black/60 overflow-hidden z-50">
                    <div className="h-0.5 w-full bg-gradient-to-r from-red-500 via-orange-400 to-amber-300" />
                    <div className="p-3">
                      <p className="px-3 pt-1.5 pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">Our Services</p>
                      <div className="grid grid-cols-2 gap-0.5">
                        {SERVICE_ITEMS.map((item) => (
                          <Link key={item.label} href={item.href} onClick={() => setServicesOpen(false)}
                            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors duration-150">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/[0.07] flex items-center justify-center text-red-500 group-hover:bg-red-50 dark:group-hover:bg-red-500/15 group-hover:border-red-200 dark:group-hover:border-red-500/20 transition-all duration-150">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                              </svg>
                            </span>
                            <div className="min-w-0">
                              <p className="text-[12.5px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white leading-snug">{item.label}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug mt-0.5">{item.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-2 mx-1 pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                          150+ Projects Delivered
                        </span>
                        <Link href="/#contact" onClick={() => setServicesOpen(false)} className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                          Free consultation →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/portfolio"  className={linkCls(pathname === '/portfolio')}>Portfolio</Link>
              <Link href="/blog"       className={linkCls(pathname.startsWith('/blog'))}>Blog</Link>
              <Link href="/calculator" className={linkCls(pathname === '/calculator')}>Calculator</Link>
              <Link href="/#about"     className={linkCls(false)}>About</Link>
              <Link href="/#contact"   className={linkCls(false)}>Contact</Link>
            </nav>

            {/* Desktop right */}
            <div className="hidden xl:flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-red-300 dark:hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
              <Link href="/book"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12.5px] font-bold bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-md shadow-red-600/20 hover:shadow-red-600/35 transition-all duration-200 active:scale-95">
                Book Free Call
              </Link>
            </div>

            {/* Mobile right */}
            <div className="xl:hidden flex items-center gap-1.5">
              <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300" aria-label="Toggle theme">
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"
              >
                <span className={`block h-0.5 w-5 bg-slate-700 dark:bg-white rounded transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block h-0.5 w-5 bg-slate-700 dark:bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-0.5 w-5 bg-slate-700 dark:bg-white rounded transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[900px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
            <div className="h-px bg-slate-100 dark:bg-white/[0.07] mb-2" />
            <nav className="flex flex-col gap-0.5">
              {[
                { label: 'Home',       href: '/',          d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { label: 'Portfolio',  href: '/portfolio', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: 'Blog',       href: '/blog',      d: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
                { label: 'Calculator', href: '/calculator',d: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
                { label: 'About',      href: '/#about',    d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Contact',    href: '/#contact',  d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              ].map(item => (
                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                  className={mobileLinkCls(pathname === item.href)}>
                  <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-red-500 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
                    </svg>
                  </span>
                  {item.label}
                </Link>
              ))}

              {/* Services accordion */}
              <div>
                <button onClick={() => setMobileServicesOpen(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.07] transition-colors">
                  <span className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-red-500 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    Services
                  </span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-4 mt-1 pl-3 border-l border-slate-200 dark:border-white/[0.08] flex flex-col gap-0.5 pb-1">
                    {SERVICE_ITEMS.map(item => (
                      <Link key={item.label} href={item.href}
                        onClick={() => { setMobileServicesOpen(false); setMenuOpen(false) }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        <div>
                          <p className="font-semibold text-xs leading-snug">{item.label}</p>
                          <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.07]">
              <Link href="/book" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-600/20 transition-all duration-200">
                Book Free Consultation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </header>
    </>
  )
}
