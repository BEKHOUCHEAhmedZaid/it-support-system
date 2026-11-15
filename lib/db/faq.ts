import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FaqArticle } from '@/lib/types'

export const FAQ_COLLECTION = 'faq_articles'

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

function mapDocToFaq(docId: string, data: Record<string, any>): FaqArticle {
  return {
    id: docId,
    title: data.title || '',
    content: data.content || '',
    category: data.category ?? null,
    created_by: data.createdBy || data.created_by || null,
    is_public: data.isPublic ?? data.is_public ?? true,
    created_at: formatTimestamp(data.createdAt || data.created_at),
    author: data.createdByName ? {
      id: data.createdBy || '',
      role: 'technician',
      full_name: data.createdByName,
      avatar_url: null,
    } : (data.author ?? undefined),
  }
}

export async function getFaqArticles(isPublicOnly: boolean = false): Promise<FaqArticle[]> {
  const colRef = collection(db, FAQ_COLLECTION)
  let q = query(colRef, orderBy('createdAt', 'desc'))

  if (isPublicOnly) {
    q = query(colRef, where('isPublic', '==', true), orderBy('createdAt', 'desc'))
  }

  const snap = await getDocs(q)
  return snap.docs.map((d) => mapDocToFaq(d.id, d.data()))
}

export async function createFaqArticle(data: {
  title: string
  content: string
  category?: string | null
  createdBy: string
  createdByName?: string | null
  isPublic?: boolean
}): Promise<string> {
  const colRef = collection(db, FAQ_COLLECTION)
  const docRef = await addDoc(colRef, {
    title: data.title,
    content: data.content,
    category: data.category ?? null,
    createdBy: data.createdBy,
    createdByName: data.createdByName ?? null,
    isPublic: data.isPublic ?? true,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}
