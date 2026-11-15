'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'
import { SignOutButton } from '@/components/layout/SignOutButton'
import { TicketSearch } from '@/components/layout/TicketSearch'
import { useAuth } from '@/context/AuthContext'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()

  return (
    <ProtectedRoute allowedRoles={['client', 'admin']}>
      <div className="flex flex-1">
        <Sidebar role="client" userName={profile?.full_name || undefined} userAvatar={profile?.avatar_url} />
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top bar */}
          <div className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Espace Client</h2>
            </div>
            <div className="flex items-center gap-4">
              <TicketSearch />
              <SignOutButton />
            </div>
          </div>
          <main className="flex-1 p-6 bg-gray-50/50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
