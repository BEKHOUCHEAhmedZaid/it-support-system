'use client'

import {
  updateTechnicianStatus as dbUpdateTechnicianStatus,
  deleteUserProfile as dbDeleteUserProfile,
  getUserProfile,
} from '@/lib/db/users'
import { assignTicket as dbAssignTicket } from '@/lib/db/tickets'

export async function updateTechnicianStatus(userId: string, status: 'approved' | 'rejected') {
  try {
    await dbUpdateTechnicianStatus(userId, status)
    return { success: true }
  } catch (error: any) {
    console.error(`[Admin] Erreur mise à jour statut technicien ${userId}:`, error)
    return { error: error.message || 'Erreur lors de la mise à jour.' }
  }
}

export async function assignTicket(ticketId: string, technicianId: string) {
  try {
    const techProfile = await getUserProfile(technicianId)
    await dbAssignTicket(
      ticketId,
      technicianId,
      techProfile?.full_name || 'Technicien'
    )
    return { success: true }
  } catch (error: any) {
    console.error('Erreur assignation ticket par admin:', error)
    return { error: error.message || 'Erreur lors de l\'assignation.' }
  }
}

export async function deleteUser(userId: string) {
  try {
    // Soft-delete : passe le statut du profil à 'disabled'
    await dbDeleteUserProfile(userId)
    return { success: true }
  } catch (error: any) {
    console.error(`[Admin] Erreur désactivation utilisateur ${userId}:`, error)
    return { error: error.message || 'Erreur lors de la désactivation du compte.' }
  }
}
