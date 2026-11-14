'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'
import { SignOutButton } from '@/components/layout/SignOutButton'
import { useAuth } from '@/context/AuthContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex flex-1">
        <Sidebar role="admin" userName={profile?.full_name || undefined} userAvatar={profile?.avatar_url} />
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top bar */}
          <div className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-100 shadow-sm z-10">
            <h2 className="text-sm font-black text-purple-600 uppercase tracking-[0.2em]">Gestion Système</h2>
            <div className="flex items-center gap-4">
              <SignOutButton />
            </div>
          </div>
          <main className="flex-1 p-8 bg-gray-50/50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
