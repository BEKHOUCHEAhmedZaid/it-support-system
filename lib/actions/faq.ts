'use client'

import { auth } from '@/lib/firebase'
import { createFaqArticle as dbCreateFaqArticle } from '@/lib/db/faq'
import { getUserProfile } from '@/lib/db/users'

export async function createFaqArticle(formData: FormData) {
  const user = auth.currentUser
  if (!user) return { error: 'Non authentifié' }

  const title = (formData.get('title') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const category = (formData.get('category') as string)?.trim() || null
  const is_public = formData.get('is_public') === 'true'

  if (!title || !content) {
    return { error: 'Veuillez saisir un titre et un contenu.' }
  }

  try {
    const profile = await getUserProfile(user.uid)
    await dbCreateFaqArticle({
      title,
      content,
      category,
      createdBy: user.uid,
      createdByName: profile?.full_name || 'Technicien',
      isPublic: is_public,
    })
    return { success: true }
  } catch (error: any) {
    console.error('Erreur création article FAQ:', error)
    return { error: error.message || 'Erreur lors de la création de l\'article.' }
  }
}
