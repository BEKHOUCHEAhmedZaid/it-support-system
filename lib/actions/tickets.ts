'use client'

import { auth } from '@/lib/firebase'
import {
  createTicket as dbCreateTicket,
  assignTicket as dbAssignTicket,
  resolveTicket as dbResolveTicket,
} from '@/lib/db/tickets'
import { sendMessage as dbSendMessage } from '@/lib/db/messages'
import { submitFeedback as dbSubmitFeedback } from '@/lib/db/feedback'
import { getUserProfile } from '@/lib/db/users'
import type { TicketCategory, TicketPriority } from '@/lib/types'

// ── CREATE TICKET ──────────────────────────────────
export async function createTicket(formData: FormData) {
  const user = auth.currentUser
  if (!user) return { error: 'Non authentifié' }

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const category = formData.get('category') as TicketCategory
  const priority = formData.get('priority') as TicketPriority
  const screenshot_url = (formData.get('screenshot_url') as string) || null
  const system_info = (formData.get('system_info') as string) || ''

  if (!title || !description) {
    return { error: 'Veuillez remplir le titre et la description.' }
  }

  try {
    const profile = await getUserProfile(user.uid)
    const employeeName = profile?.full_name || user.displayName || 'Client'
    const employeeAvatar = profile?.avatar_url || user.photoURL || null

    const ticketId = await dbCreateTicket({
      employeeId: user.uid,
      employeeName,
      employeeAvatar,
      title,
      description,
      category,
      priority,
      screenshotUrl: screenshot_url,
      systemInfo: system_info,
    })

    return { id: ticketId }
  } catch (error: any) {
    console.error('Erreur création ticket:', error)
    return { error: error.message || 'Erreur lors de la création du ticket.' }
  }
}

// ── ASSIGN TICKET (TECHNICIAN CLAIM) ───────────────
export async function assignTicket(ticketId: string) {
  const user = auth.currentUser
  if (!user) return { error: 'Non authentifié' }

  try {
    const profile = await getUserProfile(user.uid)
    const technicianName = profile?.full_name || user.displayName || 'Technicien'
    const technicianAvatar = profile?.avatar_url || user.photoURL || null

    await dbAssignTicket(ticketId, user.uid, technicianName, technicianAvatar)
    return { success: true }
  } catch (error: any) {
    console.error('Erreur réservation ticket:', error)
    return { error: error.message || 'Erreur lors de la réservation du ticket.' }
  }
}

// ── RESOLVE TICKET ─────────────────────────────────
export async function resolveTicket(ticketId: string, resolution: string) {
  try {
    await dbResolveTicket(ticketId, resolution)
    return { success: true }
  } catch (error: any) {
    console.error('Erreur résolution ticket:', error)
    return { error: error.message || 'Erreur lors de la résolution du ticket.' }
  }
}

// ── SEND MESSAGE ───────────────────────────────────
export async function sendMessage(ticketId: string, content: string) {
  const user = auth.currentUser
  if (!user) return { error: 'Non authentifié' }

  try {
    const profile = await getUserProfile(user.uid)
    await dbSendMessage(ticketId, {
      senderId: user.uid,
      senderName: profile?.full_name || 'Utilisateur',
      senderRole: profile?.role || 'client',
      senderAvatar: profile?.avatar_url || null,
      content,
    })
    return { success: true }
  } catch (error: any) {
    console.error('Erreur envoi message:', error)
    return { error: error.message || 'Erreur lors de l\'envoi du message.' }
  }
}

// ── SUBMIT FEEDBACK ────────────────────────────────
export async function submitFeedback(ticketId: string, rating: number, comment: string) {
  const user = auth.currentUser
  if (!user) return { error: 'Non authentifié' }

  try {
    await dbSubmitFeedback({
      ticketId,
      employeeId: user.uid,
      rating,
      comment,
    })
    return { success: true }
  } catch (error: any) {
    console.error('Erreur soumission feedback:', error)
    return { error: error.message || 'Erreur lors de la soumission du feedback.' }
  }
}
