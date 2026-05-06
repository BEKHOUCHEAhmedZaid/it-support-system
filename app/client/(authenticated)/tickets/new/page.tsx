import { NewTicketForm } from '@/components/ticket/NewTicketForm'
import { createClient }  from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'

export default async function NewTicketPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Signaler un problème</h1>
      <p className="text-sm text-gray-500">Décrivez votre souci technique pour qu&apos;un technicien puisse intervenir.</p>
      <NewTicketForm userId={user.id} />
    </div>
  )
}
