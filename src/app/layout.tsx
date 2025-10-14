import type { Metadata } from 'next'
import '@/styles/globals.css'
import Providers from '@/lib/providers'

export const metadata: Metadata = {
  title: 'FutureGuide Admin Dashboard',
  description: 'Admin dashboard for managing users, jobs, and chatbot monitoring',
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
        </Providers>
      </body>
    </html>
  )
}