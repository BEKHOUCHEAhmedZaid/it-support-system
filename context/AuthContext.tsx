'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserProfile } from '@/lib/db/users'
import type { Profile } from '@/lib/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  authError: string | null
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  authError: null,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [authError, setAuthError] = useState<string | null>(null)

  const fetchProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setUser(null)
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const p = await getUserProfile(currentUser.uid)

      if (!p) {
        // Utilisateur connecté dans Firebase Auth mais sans document Firestore
        await firebaseSignOut(auth)
        setUser(null)
        setProfile(null)
        setAuthError('Profil utilisateur introuvable. Veuillez contacter un administrateur.')
        setLoading(false)
        return
      }

      if (p.status === 'disabled') {
        // Utilisateur désactivé par l'administrateur
        await firebaseSignOut(auth)
        setUser(null)
        setProfile(null)
        setAuthError('Votre compte a été désactivé par un administrateur.')
        setLoading(false)
        return
      }

      setUser(currentUser)
      setProfile(p)
      setAuthError(null)
    } catch (err: any) {
      console.error('Erreur chargement profil utilisateur:', err)
      setAuthError(err.message || 'Erreur de chargement du profil.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true)
      await fetchProfile(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setProfile(null)
    setAuthError(null)
  }

  const refreshProfile = async () => {
    if (auth.currentUser) {
      await fetchProfile(auth.currentUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
