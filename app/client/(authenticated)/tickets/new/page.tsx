'use client'

import { NewTicketForm } from '@/components/ticket/NewTicketForm'
import { useAuth } from '@/context/AuthContext'

export default function NewTicketPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Signaler un problème</h1>
      <p className="text-sm text-gray-500">Décrivez votre souci technique pour qu&apos;un technicien puisse intervenir.</p>
      <NewTicketForm userId={user.uid} />
    </div>
  )
}
