'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Ticket } from '@/lib/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { useAuth } from '@/context/AuthContext'
import { getTechnicianTickets } from '@/lib/db/tickets'

function TechnicianTicketsContent() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') ?? undefined
  const searchFilter = searchParams.get('search') ?? undefined

  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!user) return

    let isMounted = true
    setLoading(true)
    setError(null)

    getTechnicianTickets(user.uid, {
      status: statusFilter,
      search: searchFilter,
    })
      .then((data) => {
        if (isMounted) {
          setTickets(data)
          setLoading(false)
        }
      })
      .catch((err: any) => {
        console.error('[TechnicianTicketsPage] Erreur lors du chargement des tickets:', err)
        if (isMounted) {
          let userMessage = 'Impossible de charger la liste des tickets.'
          if (err?.code === 'permission-denied') {
            userMessage =
              'Accès refusé par les règles de sécurité Firestore. Vérifiez que votre compte technicien a bien été approuvé ("status: approved") par un administrateur dans Firestore, et que les règles de sécurité Firestore sont publiées.'
          } else if (err?.code === 'failed-precondition') {
            userMessage =
              'Un index composite Firestore est manquant ou en cours de génération. Détails : ' +
              (err.message || 'index requis')
          } else if (err?.message) {
            userMessage = `Erreur (${err.code || 'Firestore'}) : ${err.message}`
          }
          setError(userMessage)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [user, statusFilter, searchFilter, retryCount])

  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length
  const openCount = tickets.filter((t) => t.status === 'open').length
  const resolvedTodayCount = tickets.filter(
    (t) =>
      t.status === 'resolved' &&
      t.resolved_at?.startsWith(new Date().toISOString().slice(0, 10))
  ).length

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mes Missions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez vos interventions en cours et prenez en charge les nouveaux tickets ouverts.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Performance</span>
            <span className="text-sm font-bold text-gray-900">{resolvedTodayCount} Résolus aujourd&apos;hui</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Message d'erreur visible si le chargement échoue */}
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50/80 p-6 text-red-900 shadow-xl shadow-red-500/5 animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-red-900">Erreur lors de la récupération des tickets</h3>
              <p className="text-xs text-red-700 mt-1.5 leading-relaxed font-medium">{error}</p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRetryCount((c) => c + 1)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réessayer
                </button>
                <span className="text-[11px] text-red-500 font-medium">
                  Les détails techniques complets sont disponibles dans la console du navigateur (F12).
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-200 overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <p className="text-xs font-bold text-blue-100 uppercase tracking-widest opacity-80">Tickets ouverts à prendre</p>
          <p className="text-5xl font-black mt-2">{openCount}</p>
          <p className="text-sm text-blue-100 mt-4 font-medium italic">&quot;Disponibles pour prise en charge&quot;</p>
        </div>

        <div className="rounded-3xl bg-primary p-8 text-white shadow-xl shadow-blue-200 overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <p className="text-xs font-bold text-blue-100 uppercase tracking-widest opacity-80">Mes dossiers en cours</p>
          <p className="text-5xl font-black mt-2">{inProgressCount}</p>
          <p className="text-sm text-blue-100 mt-4 font-medium italic">&quot;Priorité sur vos interventions&quot;</p>
        </div>

        <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-xl shadow-gray-100/30">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total visible</p>
          <p className="text-5xl font-black text-gray-900 mt-2">{tickets.length}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Interventions ouvertes &amp; assignées
            </span>
          </div>
        </div>
      </div>

      {/* Tableau des interventions */}
      <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-100/30 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Liste des interventions</h2>
          {tickets.length > 0 && (
            <span className="text-xs text-gray-400 font-medium">
              {tickets.length} ticket{tickets.length > 1 ? 's' : ''} au total
            </span>
          )}
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
                  {['Détails', 'Demandeur', 'Priorité', 'Statut', 'Assignation', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">
                      {error
                        ? 'Le chargement des interventions a échoué (voir le message d’erreur ci-dessus).'
                        : 'Aucun ticket à traiter pour le moment (aucun ticket ouvert ni assigné).'}
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => {
                    const isAssignedToMe = user && ticket.technician_id === user.uid
                    const isUnassigned = !ticket.technician_id

                    return (
                      <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-5">
                          <Link href={`/technician/tickets/${ticket.id}`} className="block">
                            <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {ticket.title}
                            </p>
                            <p className="text-[10px] font-mono text-gray-400 mt-0.5 uppercase">
                              #{ticket.id.slice(0, 8)}
                            </p>
                          </Link>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-gray-700">{ticket.employee?.full_name ?? 'Client'}</span>
                        </td>
                        <td className="px-6 py-5">
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-6 py-5">
                          {isUnassigned ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              À prendre
                            </span>
                          ) : isAssignedToMe ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                              Moi
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {ticket.technician?.full_name || 'Autre technicien'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-xs text-gray-500 font-medium">
                          {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TechnicianTicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm font-medium text-gray-500">Chargement...</span>
          </div>
        </div>
      }
    >
      <TechnicianTicketsContent />
    </Suspense>
  )
}
