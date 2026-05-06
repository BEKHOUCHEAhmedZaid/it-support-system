import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title:       'IT-Fix — Support Informatique',
  description: 'Plateforme de gestion de tickets IT pour employés et techniciens.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main className="flex min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  )
}
