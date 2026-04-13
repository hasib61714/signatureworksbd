'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('swTheme')
    if (saved) setDark(saved === 'dark')
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transitioning')
    const timer = setTimeout(() => root.classList.remove('theme-transitioning'), 350)
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('swTheme', dark ? 'dark' : 'light')
    return () => clearTimeout(timer)
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(v => !v) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
