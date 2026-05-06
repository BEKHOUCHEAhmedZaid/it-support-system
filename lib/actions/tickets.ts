'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ── CREATE TICKET ──────────────────────────────────
export async function createTicket(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const title          = formData.get('title') as string
  const description    = formData.get('description') as string
  const category       = formData.get('category') as string
  const priority       = formData.get('priority') as string
  const screenshot_url = formData.get('screenshot_url') as string | null
  const system_info    = JSON.parse(formData.get('system_info') as string || '{}')

  const { data, error } = await supabase.from('tickets').insert({
    employee_id: user.id,
    title,
    description,
    category,
    priority,
    screenshot_url,
    system_info,
  }).select().single()

  if (error) return { error: error.message }

  revalidatePath('/client/tickets')
  revalidatePath('/admin/tickets')
  redirect(`/client/tickets/${data.id}`)
}

// ── ASSIGN TICKET ──────────────────────────────────
export async function assignTicket(ticketId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  console.log(`[Action] User ${user.id} attempting to claim ticket ${ticketId}`)

  const { error } = await supabase
    .from('tickets')
    .update({ 
      technician_id: user.id, 
      status: 'in_progress' 
    })
    .eq('id', ticketId)
    .is('technician_id', null) // Only claim if unassigned

  if (error) {
    console.error(`[Action] Error claiming ticket ${ticketId}:`, error)
    return { error: error.message }
  }

  console.log(`[Action] Successfully claimed ticket ${ticketId}`)

  revalidatePath(`/technician/tickets/${ticketId}`)
  revalidatePath('/technician/tickets')
  revalidatePath('/admin/tickets')
  revalidatePath(`/admin/tickets/${ticketId}`)
  
  return { success: true }
}

// ── RESOLVE TICKET ─────────────────────────────────
export async function resolveTicket(ticketId: string, resolution: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tickets')
    .update({ 
      status: 'resolved', 
      resolution,
      resolved_at: new Date().toISOString()
    })
    .eq('id', ticketId)

  if (error) return { error: error.message }
  revalidatePath(`/technician/tickets/${ticketId}`)
  revalidatePath('/technician/tickets')
  revalidatePath('/admin/tickets')
  revalidatePath(`/client/tickets/${ticketId}`)
}

// ── SEND MESSAGE ───────────────────────────────────
export async function sendMessage(ticketId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { error } = await supabase.from('messages').insert({
    ticket_id: ticketId,
    sender_id: user.id,
    content,
  })
  if (error) return { error: error.message }
}

// ── SUBMIT FEEDBACK ────────────────────────────────
export async function submitFeedback(ticketId: string, rating: number, comment: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('feedback').insert({
    ticket_id: ticketId,
    rating,
    comment,
  })
  if (error) return { error: error.message }

  revalidatePath(`/client/tickets/${ticketId}`)
}
