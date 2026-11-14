'use client'

import { MessageCenter } from '@/components/ticket/MessageCenter'
import { useAuth } from '@/context/AuthContext'

export default function ClientMessagesPage() {
  const { user } = useAuth()
  if (!user) return null

  return <MessageCenter role="client" userId={user.uid} />
}
