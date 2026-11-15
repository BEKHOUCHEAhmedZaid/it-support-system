import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Feedback } from '@/lib/types'

export const FEEDBACK_COLLECTION = 'feedback'

function formatTimestamp(ts: unknown): string {
  if (ts instanceof Timestamp) {
    return ts.toDate().toISOString()
  }
  if (typeof ts === 'string') return ts
  if (ts && typeof ts === 'object' && 'seconds' in ts) {
    return new Date((ts as { seconds: number }).seconds * 1000).toISOString()
  }
  return new Date().toISOString()
}

export async function getFeedback(ticketId: string): Promise<Feedback | null> {
  const docRef = doc(db, FEEDBACK_COLLECTION, ticketId)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null

  const data = snap.data()
  return {
    id: snap.id,
    ticket_id: data.ticketId || ticketId,
    rating: data.rating ?? 5,
    comment: data.comment ?? null,
    created_at: formatTimestamp(data.createdAt || data.created_at),
  }
}

export async function submitFeedback(data: {
  ticketId: string
  employeeId: string
  rating: number
  comment?: string | null
}): Promise<void> {
  // L'ID du document est l'ID du ticket pour garantir 1 seul feedback par ticket
  const docRef = doc(db, FEEDBACK_COLLECTION, data.ticketId)
  await setDoc(docRef, {
    ticketId: data.ticketId,
    employeeId: data.employeeId,
    rating: data.rating,
    comment: data.comment ?? null,
    createdAt: serverTimestamp(),
  })
}
