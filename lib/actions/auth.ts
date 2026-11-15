'use client'

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserProfile, createUserProfile } from '@/lib/db/users'
import type { Role } from '@/lib/types'

export async function signIn(formData: FormData, expectedRole: Role) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Veuillez saisir votre email et mot de passe.' }
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Lecture du profil utilisateur dans Firestore
    const profile = await getUserProfile(user.uid)

    if (!profile) {
      await firebaseSignOut(auth)
      return { error: 'Profil introuvable. Veuillez contacter un administrateur.' }
    }

    // Vérification du statut de désactivation
    if (profile.status === 'disabled') {
      await firebaseSignOut(auth)
      return { error: 'Ce compte a été désactivé par un administrateur.' }
    }

    // Validation stricte du rôle
    const dbRole = profile.role
    const isAuthorized =
      dbRole === expectedRole ||
      dbRole === 'admin'

    if (!isAuthorized) {
      await firebaseSignOut(auth)
      const roleLabel =
        expectedRole === 'technician'
          ? 'Technicien'
          : expectedRole === 'admin'
          ? 'Administration'
          : 'Client'
      return {
        error: `Accès refusé. Vous n'avez pas l'autorisation d'accéder à l'interface ${roleLabel}.`,
      }
    }

    // Vérification du statut d'approbation pour les techniciens
    if (dbRole === 'technician' && profile.status !== 'approved') {
      await firebaseSignOut(auth)
      return {
        error:
          profile.status === 'rejected'
            ? 'Votre demande a été refusée.'
            : "Votre compte est en attente d'approbation par un administrateur.",
      }
    }

    return { user, role: dbRole }
  } catch (error: any) {
    console.error('Erreur de connexion:', error)
    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      return { error: 'Identifiants invalides (email ou mot de passe incorrect).' }
    }
    if (error.code === 'auth/too-many-requests') {
      return { error: 'Trop de tentatives échouées. Veuillez réessayer plus tard.' }
    }
    return { error: error.message || 'Une erreur est survenue lors de la connexion.' }
  }
}

export async function signUp(formData: FormData, role: Role) {
  // SÉCURITÉ : Interdiction stricte de l'inscription publique administrateur
  if (role === 'admin') {
    return { error: "L'inscription d'administrateur est restreinte." }
  }

  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const fullName = (formData.get('full_name') as string)?.trim() || ''

  if (!email || !password) {
    return { error: 'Veuillez renseigner tous les champs obligatoires.' }
  }

  try {
    // 1. Création de l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // 2. Création du profil utilisateur correspondant dans Firestore
    await createUserProfile(user.uid, {
      role,
      full_name: fullName,
      email,
      status: role === 'technician' ? 'pending' : 'approved',
    })

    return { user }
  } catch (error: any) {
    console.error("Erreur d'inscription:", error)
    if (error.code === 'auth/email-already-in-use') {
      return { error: 'Un compte existe déjà avec cette adresse email.' }
    }
    if (error.code === 'auth/weak-password') {
      return { error: 'Le mot de passe doit comporter au moins 6 caractères.' }
    }
    return { error: error.message || "Une erreur est survenue lors de la création du compte." }
  }
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export function getRedirectPath(role: string): string {
  if (role === 'admin') return '/admin/tickets'
  if (role === 'technician') return '/technician/tickets'
  return '/client/tickets'
}
