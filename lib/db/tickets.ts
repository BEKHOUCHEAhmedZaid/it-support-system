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
      avatar_url: null, // avatar non copié dans les tickets — affichage par initiales
    } : (data.employee ?? undefined),
    technician: data.technicianId ? {
      id: data.technicianId,
      role: 'technician',
      full_name: data.technicianName ?? null,
      avatar_url: null, // avatar non copié dans les tickets — affichage par initiales
    } : null,
  }
}

export async function createTicket(data: {
  employeeId: string
  employeeName: string
  // employeeAvatar intentionnellement absent : on n'enregistre plus l'avatar dans le ticket
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
    technicianId: null,
    technicianName: null,
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
  try {
    const docRef = doc(db, TICKETS_COLLECTION, ticketId)
    const snap = await getDoc(docRef)
    if (!snap.exists()) return null
    return mapDocToTicket(snap.id, snap.data())
  } catch (err: any) {
    console.error(`[getTicketById] Erreur lors de la lecture du ticket ${ticketId}:`, err)
    throw err
  }
}

export async function getClientTickets(
  employeeId: string,
  options?: { status?: string; search?: string }
): Promise<Ticket[]> {
  const colRef = collection(db, TICKETS_COLLECTION)
  
  // Utilise un tri en mémoire pour être résilient si l'index composite n'est pas encore créé
  let q = query(
    colRef,
    where('employeeId', '==', employeeId)
  )

  const snap = await getDocs(q)
  let tickets = snap.docs.map((d) => mapDocToTicket(d.id, d.data()))

  // Filtre de statut côté client si demandé
  if (options?.status) {
    tickets = tickets.filter((t) => t.status === options.status)
  }

  // Tri par date décroissante en mémoire
  tickets.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

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

  let openTickets: Ticket[] = []
  let assignedTickets: Ticket[] = []

  // 1. Requête pour les tickets ouverts disponibles (si status non spécifié ou égal à 'open')
  // On n'ajoute pas de orderBy('createdAt') directement dans la requête Firestore pour éviter d'exiger
  // un index composite Firestore obligatoire (status + createdAt). Le tri se fait en mémoire ci-dessous.
  if (!options?.status || options.status === 'open') {
    try {
      const qOpen = query(
        colRef,
        where('status', '==', 'open')
      )
      const snapOpen = await getDocs(qOpen)
      openTickets = snapOpen.docs.map(d => mapDocToTicket(d.id, d.data()))
    } catch (err: any) {
      console.error('[getTechnicianTickets] Erreur récupération des tickets ouverts (status == open):', err)
      throw err
    }
  }

  // 2. Requête pour les tickets assignés à ce technicien
  // Même chose : requête pure sur technicianId sans orderBy composite dans Firestore.
  try {
    const qAssigned = query(
      colRef,
      where('technicianId', '==', technicianId)
    )
    const snapAssigned = await getDocs(qAssigned)
    assignedTickets = snapAssigned.docs.map(d => mapDocToTicket(d.id, d.data()))

    // Si l'utilisateur filtre par statut spécifique (ex: 'in_progress', 'resolved'), on filtre en mémoire
    if (options?.status && options.status !== 'open') {
      assignedTickets = assignedTickets.filter(t => t.status === options.status)
    }
  } catch (err: any) {
    console.error('[getTechnicianTickets] Erreur récupération des tickets assignés:', err)
    throw err
  }

  // 3. Fusion et tri sans doublons (Map indexée par id)
  const ticketMap = new Map<string, Ticket>()
  for (const t of [...assignedTickets, ...openTickets]) {
    ticketMap.set(t.id, t)
  }

  // 4. Tri par date de création décroissante (du plus récent au plus ancien)
  let tickets = Array.from(ticketMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  // 5. Filtre de recherche textuelle
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
  
  let q = query(colRef)
  if (options?.status) {
    q = query(colRef, where('status', '==', options.status))
  }

  const snap = await getDocs(q)
  let tickets = snap.docs.map((d) => mapDocToTicket(d.id, d.data()))

  // Tri en mémoire par date de création décroissante
  tickets.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

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
  // technicianAvatar supprimé : non stocké dans le ticket, affichage par initiales
): Promise<void> {
  const docRef = doc(db, TICKETS_COLLECTION, ticketId)
  await updateDoc(docRef, {
    technicianId,
    technicianName: technicianName ?? null,
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
    where('hasMessages', '==', true)
  )

  const snap = await getDocs(q)
  let tickets = snap.docs.map((d) => mapDocToTicket(d.id, d.data()))

  // Tri en mémoire par date du dernier message
  tickets.sort(
    (a, b) => new Date(b.last_message_at || 0).getTime() - new Date(a.last_message_at || 0).getTime()
  )

  return tickets
}

// Abonnement en temps réel aux changements de tickets
export function subscribeToTickets(callback: () => void): () => void {
  const colRef = collection(db, TICKETS_COLLECTION)
  const unsubscribe = onSnapshot(colRef, () => {
    callback()
  })
  return unsubscribe
}
