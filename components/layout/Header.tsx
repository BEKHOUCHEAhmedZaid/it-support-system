'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { NavbarClient } from './NavbarClient'

export function Header() {
  const { user, profile } = useAuth()
  const pathname = usePathname()

  // Masque le header global dans les tableaux de bord pour éviter les doubles barres de navigation
  const isDashboard =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/technician') ||
    pathname.startsWith('/client')

  if (isDashboard && user && profile) {
    return null
  }

  // Détermine le lien du tableau de bord selon le rôle
  const getDashboardLink = () => {
    if (!profile) return '/client/tickets'
    switch (profile.role) {
      case 'admin':
        return '/admin/tickets'
      case 'technician':
        return '/technician/tickets'
      default:
        return '/client/tickets'
    }
  }

  return (
    <NavbarClient
      user={user}
      profile={profile}
      dashboardLink={getDashboardLink()}
    />
  )
}
