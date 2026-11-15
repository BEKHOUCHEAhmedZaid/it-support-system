'use client'

import { auth } from '@/lib/firebase'
import { getUserProfile, updateUserProfile } from '@/lib/db/users'

export async function updateProfile(formData: FormData) {
  const user = auth.currentUser
  if (!user) return { error: 'Non authentifié' }

  const fullNameRaw = (formData.get('full_name') as string)?.trim()
  const avatarUrlRaw = (formData.get('avatar_url') as string)?.trim()

  // Construire uniquement les champs réellement modifiés
  const updates: { full_name?: string | null; avatar_url?: string | null } = {}

  if (fullNameRaw !== undefined && fullNameRaw !== '') {
    updates.full_name = fullNameRaw
  }

  // avatar_url peut être une chaîne vide (suppression) ou une data URL base64
  if (avatarUrlRaw !== undefined) {
    updates.avatar_url = avatarUrlRaw || null
  }

  if (Object.keys(updates).length === 0) {
    return { success: true }
  }

  // Vérification taille avatar (sécurité côté client supplémentaire)
  if (updates.avatar_url && updates.avatar_url.startsWith('data:')) {
    const base64 = updates.avatar_url.split(',')[1] ?? ''
    const sizeBytes = Math.round((base64.length * 3) / 4)
    if (sizeBytes > 15 * 1024) {
      return { error: `Avatar trop lourd (${Math.round(sizeBytes / 1024)} Ko). Maximum : 15 Ko.` }
    }
  }

  try {
    await updateUserProfile(user.uid, updates)
    return { success: true }
  } catch (error: any) {
    console.error('Erreur mise à jour profil:', error)
    return { error: error.message || 'Erreur lors de la mise à jour du profil.' }
  }
}
