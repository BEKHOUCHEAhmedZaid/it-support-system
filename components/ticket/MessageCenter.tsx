'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Ticket } from '@/lib/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getTicketsForMessageCenter } from '@/lib/db/tickets'

interface Props {
  role: 'client' | 'technician'
  userId: string
}

export function MessageCenter({ role, userId }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getTicketsForMessageCenter(userId, role)
      .then((data) => {
        if (isMounted) {
          setTickets(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Erreur chargement messagerie:', err)
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [userId, role])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm font-medium text-gray-500">Chargement de vos conversations...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Centre de messagerie</h1>
        <p className="text-sm text-gray-500 mt-1">Consultez et répondez à toutes vos conversations actives.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center bg-white">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Aucune conversation</h3>
            <p className="text-sm text-gray-400 mt-1">Vos messages apparaîtront ici dès que vous aurez des échanges sur vos tickets.</p>
          </div>
        ) : (
          tickets.map(ticket => {
            const otherParty = role === 'client' ? ticket.technician : ticket.employee
            const href = role === 'client' ? `/client/tickets/${ticket.id}` : `/technician/tickets/${ticket.id}`

            return (
              <Link key={ticket.id} href={href} className="group block">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-primary font-bold overflow-hidden border border-gray-100">
                        {otherParty?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={otherParty.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          (otherParty?.full_name?.[0] ?? '?').toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-bold text-gray-900">{otherParty?.full_name ?? 'En attente d\'assignation'}</h4>
                          <StatusBadge status={ticket.status} />
                        </div>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">Sujet: {ticket.title}</p>
                      </div>
                    </div>
                    {ticket.last_message_at && (
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest whitespace-nowrap">
                        {new Date(ticket.last_message_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-end text-xs font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                    Ouvrir la discussion →
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
