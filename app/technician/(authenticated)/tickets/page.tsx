'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import type { Ticket } from '@/lib/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { useAuth } from '@/context/AuthContext'
import { getTechnicianTickets } from '@/lib/db/tickets'

export default function TechnicianTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}) {
  const params = use(searchParams)
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    let isMounted = true
    setLoading(true)

    getTechnicianTickets(user.uid, {
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
        console.error('Erreur chargement tickets technicien:', err)
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [user, params.status, params.search])

  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length
  const resolvedTodayCount = tickets.filter(
    t => t.status === 'resolved' && t.resolved_at?.startsWith(new Date().toISOString().slice(0, 10))
  ).length

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mes Missions</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos interventions et communiquez avec les employés.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Performance</span>
            <span className="text-sm font-bold text-gray-900">{resolvedTodayCount} Résolus aujourd&apos;hui</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-primary p-8 text-white shadow-xl shadow-blue-200 overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <p className="text-xs font-bold text-blue-100 uppercase tracking-widest opacity-80">En cours de traitement</p>
          <p className="text-5xl font-black mt-2">{inProgressCount}</p>
          <p className="text-sm text-blue-100 mt-4 font-medium italic">&quot;Priorité absolue sur ces dossiers&quot;</p>
        </div>
        <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-xl shadow-gray-100/30">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total assignés</p>
          <p className="text-5xl font-black text-gray-900 mt-2">{tickets.length}</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />)}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collaborateurs en attente</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-100/30 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Liste des interventions</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center">
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm font-medium text-gray-500">Chargement de vos interventions...</span>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {['Détails', 'Employé', 'Priorité', 'Statut', 'Dernière activité'].map(h => (
                    <th key={h} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">Vous n&apos;avez aucun ticket assigné pour le moment.</td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <Link href={`/technician/tickets/${ticket.id}`} className="block">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{ticket.title}</p>
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5 uppercase">#{ticket.id.slice(0, 8)}</p>
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-gray-700">{ticket.employee?.full_name ?? '—'}</span>
                      </td>
                      <td className="px-6 py-5"><PriorityBadge priority={ticket.priority} /></td>
                      <td className="px-6 py-5"><StatusBadge status={ticket.status} /></td>
                      <td className="px-6 py-5 text-xs text-gray-500 font-medium">
                        {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
