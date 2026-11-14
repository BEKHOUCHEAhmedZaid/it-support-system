import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  or,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Ticket, TicketCategory, TicketPriority, TicketStatus } from '@/lib/types'

export const TICKETS_COLLECTION = 'tickets'

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

// Convertit un document Firestore en objet Ticket pour les composants de l'application
function mapDocToTicket(docId: string, data: Record<string, any>): Ticket {
  return {
    id: docId,
    employee_id: data.employeeId || data.employee_id || '',
    technician_id: data.technicianId || data.technician_id || null,
    title: data.title || '',
    description: data.description || '',
    category: data.category as TicketCategory,
    priority: data.priority as TicketPriority,
    status: data.status as TicketStatus,
    system_info: data.systemInfo || data.system_info || '',
    screenshot_url: data.screenshotUrl || data.screenshot_url || null,
    created_at: formatTimestamp(data.createdAt || data.created_at),
    resolved_at: data.resolvedAt || data.resolved_at ? formatTimestamp(data.resolvedAt || data.resolved_at) : null,
    resolution: data.resolution ?? null,
    has_messages: Boolean(data.hasMessages || data.has_messages),
    last_message_at: data.lastMessageAt || data.last_message_at ? formatTimestamp(data.lastMessageAt || data.last_message_at) : null,
    employee: data.employeeName ? {
      id: data.employeeId || '',
      role: 'client',
      full_name: data.employeeName,
      avatar_url: data.employeeAvatar || null,
    } : (data.employee ?? undefined),
    technician: data.technicianId ? {
      id: data.technicianId,
      role: 'technician',
      full_name: data.technicianName ?? null,
      avatar_url: data.technicianAvatar ?? null,
    } : null,
  }
}

export async function createTicket(data: {
  employeeId: string
  employeeName: string
  employeeAvatar?: string | null
  title: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  systemInfo?: string | Record<string, unknown>
  screenshotUrl?: string | null
}): Promise<string> {
  const colRef = collection(db, TICKETS_COLLECTION)
  const docRef = await addDoc(colRef, {
    employeeId: data.employeeId,
    employeeName: data.employeeName,
    employeeAvatar: data.employeeAvatar ?? null,
    technicianId: null,
    technicianName: null,
    technicianAvatar: null,
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority,
    status: 'open',
    systemInfo: typeof data.systemInfo === 'string' ? data.systemInfo : JSON.stringify(data.systemInfo || {}),
    screenshotUrl: data.screenshotUrl ?? null,
    resolution: null,
    resolvedAt: null,
    hasMessages: false,
    lastMessageAt: null,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getTicketById(ticketId: string): Promise<Ticket | null> {
  const docRef = doc(db, TICKETS_COLLECTION, ticketId)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null
  return mapDocToTicket(snap.id, snap.data())
}

export async function getClientTickets(
  employeeId: string,
  options?: { status?: string; search?: string }
): Promise<Ticket[]> {
  const colRef = collection(db, TICKETS_COLLECTION)
  let q = query(
    colRef,
    where('employeeId', '==', employeeId),
    orderBy('createdAt', 'desc')
  )

  if (options?.status) {
    q = query(
      colRef,
      where('employeeId', '==', employeeId),
      where('status', '==', options.status),
      orderBy('createdAt', 'desc')
    )
  }

  const snap = await getDocs(q)
  let tickets = snap.docs.map((d) => mapDocToTicket(d.id, d.data()))

  if (options?.search) {
    const s = options.search.toLowerCase()
    tickets = tickets.filter(
      (t) => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s)
    )
  }

  return tickets
}

export async function getTechnicianTickets(
  technicianId: string,
  options?: { status?: string; search?: string }
): Promise<Ticket[]> {
  const colRef = collection(db, TICKETS_COLLECTION)

  // Dans Supabase: or(technician_id == user.id OR status == 'open')
  let q = query(
    colRef,
    or(
      where('technicianId', '==', technicianId),
      where('status', '==', 'open')
    ),
    orderBy('createdAt', 'desc')
  )

  if (options?.status) {
    q = query(
      colRef,
      or(
        where('technicianId', '==', technicianId),
        where('status', '==', 'open')
      ),
      where('status', '==', options.status),
      orderBy('createdAt', 'desc')
    )
  }

  const snap = await getDocs(q)
  let tickets = snap.docs.map((d) => mapDocToTicket(d.id, d.data()))

  if (options?.search) {
    const s = options.search.toLowerCase()
    tickets = tickets.filter(
      (t) => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s)
    )
  }

  return tickets
}

export async function getAllTickets(options?: { status?: string; search?: string }): Promise<Ticket[]> {
  const colRef = collection(db, TICKETS_COLLECTION)
  let q = query(colRef, orderBy('createdAt', 'desc'))

  if (options?.status) {
    q = query(colRef, where('status', '==', options.status), orderBy('createdAt', 'desc'))
  }

  const snap = await getDocs(q)
  let tickets = snap.docs.map((d) => mapDocToTicket(d.id, d.data()))

  if (options?.search) {
    const s = options.search.toLowerCase()
    tickets = tickets.filter(
      (t) => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s)
    )
  }

  return tickets
}

export async function assignTicket(
  ticketId: string,
  technicianId: string,
  technicianName?: string | null,
  technicianAvatar?: string | null
): Promise<void> {
  const docRef = doc(db, TICKETS_COLLECTION, ticketId)
  await updateDoc(docRef, {
    technicianId,
    technicianName: technicianName ?? null,
    technicianAvatar: technicianAvatar ?? null,
    status: 'in_progress',
    updatedAt: serverTimestamp(),
  })
}

export async function resolveTicket(ticketId: string, resolution: string): Promise<void> {
  const docRef = doc(db, TICKETS_COLLECTION, ticketId)
  await updateDoc(docRef, {
    status: 'resolved',
    resolution,
    resolvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getTicketsForMessageCenter(
  userId: string,
  role: 'client' | 'technician'
): Promise<Ticket[]> {
  const colRef = collection(db, TICKETS_COLLECTION)
  const fieldToFilter = role === 'client' ? 'employeeId' : 'technicianId'

  const q = query(
    colRef,
    where(fieldToFilter, '==', userId),
    where('hasMessages', '==', true),
    orderBy('lastMessageAt', 'desc')
  )

  const snap = await getDocs(q)
  return snap.docs.map((d) => mapDocToTicket(d.id, d.data()))
}

// Abonnement en temps réel aux changements de tickets (remplace RealTimeTickets)
export function subscribeToTickets(callback: () => void): () => void {
  const colRef = collection(db, TICKETS_COLLECTION)
  const unsubscribe = onSnapshot(colRef, () => {
    callback()
  })
  return unsubscribe
}
