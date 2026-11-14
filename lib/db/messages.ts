import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Message, Role } from '@/lib/types'
import { TICKETS_COLLECTION } from './tickets'

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

function mapDocToMessage(docId: string, ticketId: string, data: Record<string, any>): Message {
  return {
    id: docId,
    ticket_id: ticketId,
    sender_id: data.senderId || data.sender_id || '',
    content: data.content || '',
    created_at: formatTimestamp(data.createdAt || data.created_at),
    sender: data.senderName ? {
      id: data.senderId || data.sender_id || '',
      role: (data.senderRole || 'client') as Role,
      full_name: data.senderName,
      avatar_url: data.senderAvatar ?? null,
    } : (data.sender ?? undefined),
  }
}

export async function getMessages(ticketId: string): Promise<Message[]> {
  const colRef = collection(db, TICKETS_COLLECTION, ticketId, 'messages')
  const q = query(colRef, orderBy('createdAt', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => mapDocToMessage(d.id, ticketId, d.data()))
}

export async function sendMessage(
  ticketId: string,
  data: {
    senderId: string
    senderName: string
    senderRole: Role
    senderAvatar?: string | null
    content: string
  }
): Promise<string> {
  const messagesColRef = collection(db, TICKETS_COLLECTION, ticketId, 'messages')
  const messageDoc = await addDoc(messagesColRef, {
    senderId: data.senderId,
    senderName: data.senderName,
    senderRole: data.senderRole,
    senderAvatar: data.senderAvatar ?? null,
    content: data.content,
    createdAt: serverTimestamp(),
  })

  // Met à jour les métadonnées de messages sur le ticket parent pour MessageCenter
  const ticketDocRef = doc(db, TICKETS_COLLECTION, ticketId)
  await updateDoc(ticketDocRef, {
    hasMessages: true,
    lastMessageAt: serverTimestamp(),
  }).catch((err) => {
    console.error('Erreur mise à jour métadonnées message sur ticket:', err)
  })

  return messageDoc.id
}

// Écoute en temps réel des messages d'un ticket (remplace Supabase realtime)
export function subscribeToMessages(
  ticketId: string,
  callback: (messages: Message[]) => void
): () => void {
  const colRef = collection(db, TICKETS_COLLECTION, ticketId, 'messages')
  const q = query(colRef, orderBy('createdAt', 'asc'))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((d) => mapDocToMessage(d.id, ticketId, d.data()))
    callback(msgs)
  })

  return unsubscribe
}
