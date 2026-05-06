import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MessageCenter } from '@/components/ticket/MessageCenter'

export default async function TechnicianMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return <MessageCenter role="technician" userId={user.id} />
}
