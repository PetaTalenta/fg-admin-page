import type { Metadata } from 'next'
import '@/styles/globals.css'
import Providers from '@/lib/providers'
import { ToastContainer } from '@/components/common/Toast'

export const metadata: Metadata = {
  title: 'FutureGuide Admin Dashboard',
  description: 'Admin dashboard for managing users, jobs, and chatbot monitoring',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}