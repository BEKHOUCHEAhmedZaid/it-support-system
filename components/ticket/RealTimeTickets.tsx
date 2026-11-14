'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { subscribeToTickets } from '@/lib/db/tickets'

export function RealTimeTickets() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = subscribeToTickets(() => {
      router.refresh()
    })

    return () => {
      unsubscribe()
    }
  }, [router])

  return null
}
