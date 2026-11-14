import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Profile, ProfileStatus, Role } from '@/lib/types'

export const USERS_COLLECTION = 'users'

export async function getUserProfile(uid: string): Promise<Profile | null> {
  const docRef = doc(db, USERS_COLLECTION, uid)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null

  const data = snap.data()
  return {
    id: snap.id,
    role: data.role as Role,
    full_name: data.full_name ?? null,
    avatar_url: data.avatar_url ?? null,
    status: data.status as ProfileStatus,
    email: data.email ?? undefined,
  }
}

export async function createUserProfile(
  uid: string,
  data: {
    role: Role
    full_name: string | null
    email: string
    avatar_url?: string | null
    status?: ProfileStatus
  }
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid)
  await setDoc(docRef, {
    uid,
    role: data.role,
    full_name: data.full_name,
    email: data.email,
    avatar_url: data.avatar_url ?? null,
    status: data.status ?? (data.role === 'technician' ? 'pending' : 'approved'),
    created_at: serverTimestamp(),
  })
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid)
  await updateDoc(docRef, {
    ...updates,
    updated_at: serverTimestamp(),
  })
}

export async function getTechnicians(status?: ProfileStatus): Promise<Profile[]> {
  const colRef = collection(db, USERS_COLLECTION)
  let q = query(colRef, where('role', '==', 'technician'))
  if (status) {
    q = query(colRef, where('role', '==', 'technician'), where('status', '==', status))
  }
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      role: data.role as Role,
      full_name: data.full_name ?? null,
      avatar_url: data.avatar_url ?? null,
      status: data.status as ProfileStatus,
      email: data.email ?? undefined,
    }
  })
}

export async function getAllClients(): Promise<Profile[]> {
  const colRef = collection(db, USERS_COLLECTION)
  const q = query(colRef, where('role', '==', 'client'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      role: data.role as Role,
      full_name: data.full_name ?? null,
      avatar_url: data.avatar_url ?? null,
      status: data.status as ProfileStatus,
      email: data.email ?? undefined,
    }
  })
}

export async function getAllUsers(): Promise<Profile[]> {
  const colRef = collection(db, USERS_COLLECTION)
  const snap = await getDocs(colRef)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      role: data.role as Role,
      full_name: data.full_name ?? null,
      avatar_url: data.avatar_url ?? null,
      status: data.status as ProfileStatus,
      email: data.email ?? undefined,
    }
  })
}

export async function updateTechnicianStatus(
  uid: string,
  status: 'approved' | 'rejected'
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid)
  await updateDoc(docRef, {
    status,
    updated_at: serverTimestamp(),
  })
}

export async function deleteUserProfile(uid: string): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid)
  await deleteDoc(docRef)
}
