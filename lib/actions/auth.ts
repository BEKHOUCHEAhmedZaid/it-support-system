'use client'
import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/lib/types'

export async function signIn(formData: FormData, expectedRole: Role) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }

  // Fetch profile to determine role and status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', data.user?.id)
    .single()

  if (profileError || !profile) {
    await supabase.auth.signOut()
    return { error: "Profil introuvable. Veuillez contacter un administrateur." }
  }

  // STRICT ROLE VALIDATION
  const dbRole = profile.role
  const isAuthorized = 
    dbRole === expectedRole || 
    dbRole === 'admin' || 
    (dbRole === 'employee' && expectedRole === 'client')

  if (!isAuthorized) {
    await supabase.auth.signOut()
    return { error: `Accès refusé. Vous n'avez pas l'autorisation d'accéder à l'interface ${expectedRole === 'technician' ? 'Technicien' : expectedRole === 'admin' ? 'Administration' : 'Client'}.` }
  }

  // Technician approval check
  if (dbRole === 'technician' && profile.status !== 'approved') {
    await supabase.auth.signOut()
    return { 
      error: profile.status === 'rejected' 
        ? "Votre demande a été refusée." 
        : "Votre compte est en attente d'approbation par un administrateur." 
    }
  }

  return { data, role: dbRole }
}

export async function signUp(formData: FormData, role: Role) {
  // SECURITY: Prevent public admin registration
  if (role === 'admin') {
    return { error: "L'inscription d'administrateur est restreinte." }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const supabase = createClient()

  // 1. Create Auth User
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
        status: role === 'technician' ? 'pending' : 'approved'
      }
    }
  })

  if (authError) return { error: authError.message }
  if (!data.user) return { error: "Une erreur inconnue est survenue lors de la création du compte." }

  // 2. Profile entry is handled automatically by the 'on_auth_user_created' trigger in SQL
  // No need for manual insert here to avoid duplicate key errors.

  return { data }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}

export function getRedirectPath(role: string) {
  if (role === 'admin') return '/admin/tickets'
  if (role === 'technician') return '/technician/tickets'
  return '/client/tickets'
}
