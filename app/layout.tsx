import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'IT-Fix — Support Informatique',
  description: 'Plateforme de gestion de tickets IT pour employés et techniciens.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased flex flex-col">
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
