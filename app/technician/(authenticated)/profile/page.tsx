'use client'

import { ProfileForm } from '@/components/profile/ProfileForm'
import { useAuth } from '@/context/AuthContext'

export default function TechnicianProfilePage() {
  const { profile } = useAuth()

  if (!profile) return null

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mon Profil</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez vos informations personnelles et votre avatar.</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  )
}
