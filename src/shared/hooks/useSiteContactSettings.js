'use client'

import { useEffect, useState } from 'react'
import { defaultContactSettings, getContactSettings } from '@/lib/db/siteSettings'

export default function useSiteContactSettings() {
  const [settings, setSettings] = useState(defaultContactSettings)

  useEffect(() => {
    let mounted = true

    getContactSettings()
      .then((data) => {
        if (mounted && data) setSettings(data)
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  return settings
}
