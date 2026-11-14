'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import type { Ticket } from '@/lib/types'
import { TicketCard } from '@/components/ticket/TicketCard'
import { TicketFilterUI } from '@/components/ticket/TicketFilterUI'
import { RealTimeTickets } from '@/components/ticket/RealTimeTickets'
import { useAuth } from '@/context/AuthContext'
import { getClientTickets } from '@/lib/db/tickets'

export default function ClientTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const params = use(searchParams)
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    let isMounted = true
    setLoading(true)

    getClientTickets(user.uid, {
      status: params.status,
      search: params.search,
    })
      .then((data) => {
        if (isMounted) {
          setTickets(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Erreur chargement tickets client:', err)
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [user, params.status, params.search])

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <RealTimeTickets />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mes Demandes</h1>
          <p className="text-sm text-gray-500 mt-1">Suivez l&apos;évolution de vos tickets de support.</p>
        </div>
        <Link 
          href="/client/tickets/new" 
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Nouveau Ticket
        </Link>
      </div>

      <TicketFilterUI />

      {loading ? (
        <div className="py-20 text-center">
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm font-medium text-gray-500">Chargement de vos tickets...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} role="client" />
            ))}
          </div>

          {tickets.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/></svg>
              </div>
              <p className="text-gray-500 font-medium">Vous n&apos;avez pas encore créé de ticket.</p>
              <Link href="/client/tickets/new" className="text-primary font-bold text-sm mt-2 inline-block hover:underline">Signaler un problème maintenant</Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
