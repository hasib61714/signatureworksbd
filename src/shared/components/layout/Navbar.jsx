'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Container from '@/shared/components/ui/Container'
import { useTheme } from '@/shared/context/ThemeContext'
import { getNavLinks, defaultNavLinks } from '@/lib/db/siteSettings'

const SERVICE_ITEMS = [
  { label: 'Architectural Design', desc: 'Concept to permit-ready drawings', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/services/architectural-design' },
  { label: 'Construction',         desc: 'Full turnkey build management',      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', href: '/services/construction' },
  { label: 'Interior Design',      desc: 'Residential & commercial spaces',    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', href: '/services/interior-design' },
  { label: 'Renovation',           desc: 'Remodel & upgrade existing spaces',  icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', href: '/services/renovation' },
  { label: 'Cost Calculator',      desc: 'Instant project estimate tool',      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', href: '/calculator' },
  { label: 'Book Consultation',    desc: 'Free 30-min expert session',         icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', href: '/book' },
]

const linkCls = (active) =>
  `relative px-3 py-2 rounded-full text-[12.5px] font-semibold transition-all duration-200 whitespace-nowrap ${
    active
      ? 'text-navy-950 bg-gradient-to-r from-gold-400 to-gold-300 shadow-md shadow-gold-500/20'
      : 'text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white hover:bg-navy-50 dark:hover:bg-navy-800/60'
  }`

const mobileLinkCls = (active) =>
  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
    active
      ? 'text-navy-950 bg-gradient-to-r from-gold-400 to-gold-300'
      : 'text-slate-700 dark:text-slate-300 hover:bg-navy-50 dark:hover:bg-navy-800/60'
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

  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [navLinks, setNavLinks] = useState(defaultNavLinks)

  useEffect(() => { setMenuOpen(false); setServicesOpen(false); setMobileServicesOpen(false) }, [pathname])

  useEffect(() => {
    getNavLinks().then(links => { if (links?.length) setNavLinks(links) }).catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setServicesOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white shadow-sm"
      >
        <Container>
          <div className="flex items-center justify-between h-[72px] gap-2">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/Signature-Works-Logo-png.png"
                alt="Signature Works"
                width={640}
                height={150}
                priority
                className="h-10 sm:h-12 md:h-14 w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[320px] object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
              {/* Home first */}
              {navLinks.filter(item => item.href === '/').map(item => (
                <Link key={item.href} href={item.href}
                  className={linkCls(pathname === '/')}>
                  {item.label}
                </Link>
              ))}

              {/* Services Dropdown — after Home */}
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
                    <div className="h-0.5 w-full bg-gradient-to-r from-navy-600 via-navy-500 to-gold-400" />
                    <div className="p-3">
                      <p className="px-3 pt-1.5 pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">Our Services</p>
                      <div className="grid grid-cols-2 gap-0.5">
                        {SERVICE_ITEMS.map((item) => (
                          <Link key={item.label} href={item.href} onClick={() => setServicesOpen(false)}
                            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors duration-150">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-white/[0.07] flex items-center justify-center text-gold-500 group-hover:bg-gold-50 dark:group-hover:bg-gold-500/15 group-hover:border-gold-200 dark:group-hover:border-gold-500/20 transition-all duration-150">
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
                        <Link href="/#contact" onClick={() => setServicesOpen(false)} className="text-[11px] font-semibold text-gold-700 dark:text-gold-300 hover:text-gold-600 flex items-center gap-1 transition-colors">
                          <span>Free consultation</span>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Remaining links (skip Home) */}
              {navLinks.filter(item => item.href !== '/').map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkCls(item.href.startsWith('/#') ? false : pathname.startsWith(item.href))}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop right */}
            <div className="hidden xl:flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-gold-300 dark:hover:border-gold-500/40 hover:text-gold-700 dark:hover:text-gold-300 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
              <Link href="/book"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12.5px] font-bold bg-gradient-to-r from-gold-500 to-amber-300 text-navy-950 hover:from-gold-400 hover:to-amber-200 shadow-md shadow-gold-500/20 hover:shadow-gold-500/35 transition-all duration-200 active:scale-95">
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
              {/* Home first */}
              {navLinks.filter(item => item.href === '/').map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  className={mobileLinkCls(pathname === '/')}>
                  <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gold-500 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon || 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'} />
                    </svg>
                  </span>
                  {item.label}
                </Link>
              ))}

              {/* Services accordion — after Home */}
              <div>
                <button onClick={() => setMobileServicesOpen(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.07] transition-colors">
                  <span className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gold-500 flex-shrink-0">
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
                        <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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

              {/* Remaining links (skip Home) */}
              {navLinks.filter(item => item.href !== '/').map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  className={mobileLinkCls(item.href.startsWith('/#') ? false : pathname.startsWith(item.href))}>
                  <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gold-500 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon || 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'} />
                    </svg>
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.07]">
              <Link href="/book" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-gold-500 to-amber-300 text-navy-950 hover:from-gold-400 hover:to-amber-200 shadow-lg shadow-gold-500/20 transition-all duration-200">
                Book Free Consultation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </header>
  )
}
