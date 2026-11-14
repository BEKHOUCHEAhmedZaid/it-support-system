'use client'

import { useEffect, useState } from 'react'
import type { Ticket, Profile } from '@/lib/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AssignButton } from '@/components/ticket/AssignButton'
import { RealTimeTickets } from '@/components/ticket/RealTimeTickets'
import { getAllTickets } from '@/lib/db/tickets'
import { getTechnicians } from '@/lib/db/users'

export default function AdminGlobalTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [technicians, setTechnicians] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    Promise.all([getAllTickets(), getTechnicians('approved')])
      .then(([t, techs]) => {
        if (isMounted) {
          setTickets(t)
          setTechnicians(techs)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Erreur chargement supervision globale:', err)
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const stats = {
    open: tickets.filter(t => t.status === 'open' || t.status === 'new').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <RealTimeTickets />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Supervision Globale</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble de tous les tickets du système.</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Ouverts', value: stats.open, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'En cours', value: stats.inProgress, color: 'text-primary', bg: 'bg-blue-50' },
            { label: 'Résolus', value: stats.resolved, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} px-4 py-3 rounded-2xl border border-white shadow-sm`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${s.color} opacity-80`}>{s.label}</p>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center">
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm font-medium text-gray-500">Chargement des données globales...</span>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Titre</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignation</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">Aucun ticket enregistré.</td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-900">{ticket.title}</p>
                        <p className="text-[10px] font-mono text-gray-400 uppercase">#{ticket.id.slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-gray-700">{ticket.employee?.full_name ?? '—'}</span>
                      </td>
                      <td className="px-6 py-5"><StatusBadge status={ticket.status} /></td>
                      <td className="px-6 py-5">
                        <AssignButton 
                          ticketId={ticket.id} 
                          technicians={technicians} 
                          currentTechnicianId={ticket.technician_id} 
                        />
                      </td>
                      <td className="px-6 py-5 text-[10px] text-gray-400 font-bold uppercase">
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
