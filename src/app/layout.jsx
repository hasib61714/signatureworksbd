import { Suspense } from 'react'
import Script from 'next/script'
import Providers from './providers'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

export const metadata = {
  title: {
    default: 'Signature Works BD — Design and Construction Studio',
    template: '%s | Signature Works BD',
  },
  description:
    'Signature Works BD — Premium architectural design, construction, and interior design studio in Dhaka, Bangladesh. 150+ projects delivered. 8+ years of excellence.',
  metadataBase: new URL('https://signatureworks.studio'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/Signature%20Works%20Logo-05.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Signature Works BD',
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

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}

        {/* Facebook Pixel */}
        {FB_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}</Script>
        )}
      </body>
    </html>
  )
}
