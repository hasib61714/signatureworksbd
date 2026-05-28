import { Suspense } from 'react'
import Providers from './providers'
import AnalyticsLoader from '@/shared/components/layout/AnalyticsLoader'
import './globals.css'

export const metadata = {
  title: {
    default: 'Signature Works — Design and Construction Studio',
    template: '%s | Signature Works',
  },
  description:
    'Signature Works — Premium architectural design, construction, and interior design studio in Dhaka, Bangladesh. 150+ projects delivered. 8+ years of excellence.',
  metadataBase: new URL('https://signatureworks.studio'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/Signature%20Works%20Logo-05.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Signature Works',
    images: ['/Signature-Works-Logo-png.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/Signature-Works-Logo-png.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
        <AnalyticsLoader />
      </body>
    </html>
  )
}
