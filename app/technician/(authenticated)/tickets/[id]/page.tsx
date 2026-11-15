'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Ticket, SystemInfo, Feedback } from '@/lib/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { ChatSection } from '@/components/ticket/ChatSection'
import { SystemInfoDisplay } from '@/components/ticket/SystemInfoDisplay'
import { ResolveTicketForm } from '@/components/ticket/ResolveTicketForm'
import { ReserveButton } from '@/components/ticket/ReserveButton'
import { useAuth } from '@/context/AuthContext'
import { getTicketById } from '@/lib/db/tickets'
import { getFeedback } from '@/lib/db/feedback'

export default function TechnicianTicketDetailPage({
  params,
}: {
  params?: { id: string }
}) {
  const routeParams = useParams()
  const rawId = params?.id || routeParams?.id
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string)

  const { user } = useAuth()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTicketData = useCallback(() => {
    if (!id) return
    setLoading(true)
    setError(null)

    getTicketById(id)
      .then(async (t) => {
        if (!t) {
          setError(
            'Ce ticket est introuvable ou vous n’avez pas la permission de le consulter (seuls les tickets ouverts ou ceux qui vous sont assignés sont accessibles aux techniciens).'
          )
          setLoading(false)
          return
        }

        setTicket(t)

        // Chargement du feedback s'il existe (isolé pour ne jamais bloquer la page)
        try {
          const f = await getFeedback(id)
          setFeedback(f)
        } catch (feedbackErr: any) {
          console.warn('[TechnicianTicketDetail] Note/feedback non accessible ou absent:', feedbackErr?.message)
        }

        setLoading(false)
      })
      .catch((err: any) => {
        console.error('[TechnicianTicketDetail] Erreur chargement ticket:', err)
        const code = err?.code ? `[${err.code}] ` : ''
        let msg = err?.message || 'Impossible de charger les détails de l’intervention.'
        if (err?.code === 'permission-denied') {
          msg =
            'Accès refusé par les règles Firestore [permission-denied]. Vérifiez que votre profil technicien est bien approuvé ("status: approved") et que les règles de sécurité sont publiées.'
        }
        setError(`${code}${msg}`)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    loadTicketData()
  }, [loadTicketData])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <div className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm font-medium text-gray-500">Chargement des détails de l&apos;intervention...</span>
        </div>
      </div>
    )
  }

  // Affichage d'erreur explicite sans 404 brutale
  if (error || !ticket) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <Link href="/technician/tickets" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux missions
          </Link>
        </nav>

        <div className="rounded-3xl border border-red-200 bg-red-50/80 p-8 text-red-900 shadow-xl shadow-red-500/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-red-900">Impossible d&apos;ouvrir ce ticket</h2>
              <p className="text-xs text-red-700 mt-2 leading-relaxed font-medium">
                {error || 'Le ticket demandé est inaccessible.'}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <button
                  type="button"
                  onClick={loadTicketData}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-sm"
                >
                  Réessayer
                </button>
                <Link
                  href="/technician/tickets"
                  className="px-5 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
                >
                  Voir les tickets disponibles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calcul des états métier du ticket
  const isMyTicket = Boolean(user && ticket.technician_id === user.uid)
  const isUnassigned = !ticket.technician_id && ticket.status === 'open'
  const isAssignedToOther = Boolean(ticket.technician_id && user && ticket.technician_id !== user.uid)

  const faqPrefill = encodeURIComponent(
    JSON.stringify({
      title: ticket.title,
      content: ticket.resolution ?? '',
      category: ticket.category,
    })
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <Link href="/technician/tickets" className="hover:text-primary transition-colors flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Espace Technicien
        </Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-mono">#{ticket.id.slice(0, 8).toUpperCase()}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm overflow-hidden shrink-0">
            {ticket.employee?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ticket.employee.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-base font-black text-gray-400">
                {(ticket.employee?.full_name || 'C').substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{ticket.title}</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Posté par <span className="text-gray-900 font-bold">{ticket.employee?.full_name ?? 'Client'}</span>
              {' · '} {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} à {new Date(ticket.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* Bannière de prise en charge : si le ticket est ouvert et non assigné */}
      {isUnassigned && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-blue-50/70 border border-blue-200 p-6 shadow-xl shadow-blue-500/5 animate-in zoom-in duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 tracking-tight">Ce ticket est en attente d&apos;intervention.</p>
              <p className="text-xs text-blue-700 mt-0.5">Prenez-le en charge pour commencer le diagnostic et échanger avec le client.</p>
            </div>
          </div>
          <ReserveButton ticketId={id} onAssigned={loadTicketData} />
        </div>
      )}

      {/* Bannière si assigné à un autre technicien */}
      {isAssignedToOther && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs font-bold text-amber-800">
          ℹ️ Ce ticket est actuellement pris en charge par un autre collaborateur ({ticket.technician?.full_name || 'Technicien'}).
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              <h2 className="text-lg font-bold text-gray-900">Description du problème</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.screenshot_url && (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                Capture d&apos;écran
              </h2>
              <div className="rounded-2xl overflow-hidden border border-gray-50 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ticket.screenshot_url} alt="Bug screenshot" className="w-full max-h-[500px] object-contain mx-auto" />
              </div>
            </div>
          )}

          {user && (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
              <ChatSection
                ticketId={id}
                currentUserId={user.uid}
                initialMessages={[]}
              />
            </div>
          )}
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Formulaire de résolution : visible UNIQUEMENT pour le technicien assigné en cours de traitement */}
          {isMyTicket && ticket.status === 'in_progress' && (
            <ResolveTicketForm ticketId={id} onResolved={loadTicketData} />
          )}

          {/* Affichage de la solution : une fois résolu */}
          {ticket.status === 'resolved' && (
            <div className="rounded-3xl bg-emerald-50/50 border border-emerald-100 p-8 shadow-xl shadow-emerald-500/5 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <h3 className="text-lg font-black text-emerald-900 leading-tight">Ticket Résolu</h3>
              </div>
              <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                {ticket.resolution || 'Problème résolu par le technicien.'}
              </p>
              {ticket.resolved_at && (
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-3">
                  Résolu le {new Date(ticket.resolved_at).toLocaleDateString('fr-FR')} à {new Date(ticket.resolved_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
              <div className="mt-8 pt-6 border-t border-emerald-100/50 flex flex-col gap-4">
                <Link
                  href={`/technician/faq?prefill=${faqPrefill}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-emerald-200 px-6 py-3 text-[11px] font-black text-emerald-700 uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter à la FAQ
                </Link>
                {feedback && (
                  <div className="pt-4 border-t border-emerald-100/40">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Note de l&apos;employé</p>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl text-amber-400">{'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}</div>
                      {feedback.comment && <p className="text-xs text-gray-500 italic leading-relaxed">&quot;{feedback.comment}&quot;</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Info */}
          <SystemInfoDisplay info={ticket.system_info as SystemInfo} />
          
          {/* Détails administratifs */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
            <h3 className="text-base font-bold text-gray-900 mb-6">Résumé administratif</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase">Ticket ID</span>
                <span className="text-xs font-mono text-gray-900 font-bold bg-gray-50 px-2 py-1 rounded">#{ticket.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase">Catégorie</span>
                <span className="text-xs font-bold text-primary bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">{ticket.category}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase">Technicien</span>
                <span className="text-xs font-bold text-gray-700">
                  {ticket.technician?.full_name || (isUnassigned ? 'Non assigné' : '—')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
