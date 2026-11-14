'use client'

import { auth } from '@/lib/firebase'
import { updateUserProfile } from '@/lib/db/users'

export async function updateProfile(formData: FormData) {
  const user = auth.currentUser
  if (!user) return { error: 'Non authentifié' }

  const fullName = (formData.get('full_name') as string)?.trim() || null
  const avatarUrl = (formData.get('avatar_url') as string)?.trim() || null

  try {
    await updateUserProfile(user.uid, {
      full_name: fullName,
      avatar_url: avatarUrl,
    })
    return { success: true }
  } catch (error: any) {
    console.error('Erreur mise à jour profil:', error)
    return { error: error.message || 'Erreur lors de la mise à jour du profil.' }
  }
}
