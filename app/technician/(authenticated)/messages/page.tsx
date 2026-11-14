'use client'

import { MessageCenter } from '@/components/ticket/MessageCenter'
import { useAuth } from '@/context/AuthContext'

export default function TechnicianMessagesPage() {
  const { user } = useAuth()
  if (!user) return null

  return <MessageCenter role="technician" userId={user.uid} />
}
