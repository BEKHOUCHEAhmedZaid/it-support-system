'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { Role } from '@/lib/types'
import { getRedirectPath } from '@/lib/actions/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading, authError, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    // 1. Si pas d'utilisateur connecté ou pas de profil
    if (!user || !profile) {
      if (pathname.startsWith('/admin')) {
        router.replace('/admin/login')
      } else if (pathname.startsWith('/technician')) {
        router.replace('/technician/login')
      } else {
        router.replace('/client/login')
      }
      return
    }

    // 2. Si le compte est désactivé
    if (profile.status === 'disabled') {
      signOut()
      router.replace('/client/login')
      return
    }

    // 3. Validation pour les techniciens (doit être approuvé)
    if (profile.role === 'technician' && profile.status !== 'approved') {
      signOut()
      router.replace('/technician/login')
      return
    }

    // 4. Validation des rôles autorisés
    if (allowedRoles && allowedRoles.length > 0) {
      const isAllowed =
        allowedRoles.includes(profile.role) || profile.role === 'admin'

      if (!isAllowed) {
        // Redirection vers le tableau de bord approprié selon son rôle
        router.replace(getRedirectPath(profile.role))
      }
    }
  }, [user, profile, loading, allowedRoles, router, pathname, signOut])

  // Écran de chargement propre pour éviter les flashs d'écran non autorisés
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <img src="/logo.png" alt="IT-Fix" className="h-12 w-auto object-contain" />
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-500">Vérification de session...</span>
          </div>
        </div>
      </div>
    )
  }

  // Si non connecté ou profil non valide, on ne rend rien le temps de la redirection
  if (!user || !profile) {
    return null
  }

  // Si technicien non approuvé
  if (profile.role === 'technician' && profile.status !== 'approved') {
    return null
  }

  // Si le rôle ne correspond pas
  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.includes(profile.role) || profile.role === 'admin'
    if (!isAllowed) return null
  }

  return <>{children}</>
}
