'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTechnicianStatus(userId: string, status: 'approved' | 'rejected') {
  const supabase = await createClient()
  
  console.log(`[Admin] Updating status for user ${userId} to ${status}...`)
  
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId)

  if (error) {
    console.error(`[Admin] Error updating status for ${userId}:`, error)
    return { error: error.message }
  }

  console.log(`[Admin] Successfully updated user ${userId} to ${status}`)

  revalidatePath('/admin/technicians')
  return { success: true }
}

export async function assignTicket(ticketId: string, technicianId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tickets')
    .update({ 
      technician_id: technicianId,
      status: 'in_progress' 
    })
    .eq('id', ticketId)

  if (error) {
    console.error('Error assigning ticket:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/tickets')
  revalidatePath('/technician/tickets')
  return { success: true }
}

export async function deleteUser(userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Non authentifié' }
  if (user.id === userId) return { error: 'Vous ne pouvez pas supprimer votre propre compte' }

  console.log(`[Admin] Deleting user ${userId}...`)

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) {
    console.error(`[Admin] Error deleting user ${userId}:`, error)
    return { error: error.message }
  }

  console.log(`[Admin] Successfully deleted user ${userId}`)

  revalidatePath('/admin/users')
  revalidatePath('/admin/technicians')
  return { success: true }
}
