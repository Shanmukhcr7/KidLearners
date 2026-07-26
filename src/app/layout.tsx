import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KidLearners | Empowering Kids with AI',
  description: 'Learn Today, Lead Tomorrow. Interactive AI education platform for future-ready skills.',
  openGraph: {
    title: 'KidLearners',
    description: 'Empowering Kids with AI & Future-Ready Skills',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  }
}

import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased min-h-screen relative bg-white text-slate-900 selection:bg-[#10B981] selection:text-white font-sans">
        <LoadingOverlay />
        <AuthProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#000000',
                color: '#ffffff',
                border: '1px solid #333333',
                borderRadius: '8px',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
