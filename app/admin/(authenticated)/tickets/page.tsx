import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Ticket } from '@/lib/types'
import { StatusBadge }   from '@/components/ui/StatusBadge'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { AssignButton }  from '@/components/ticket/AssignButton'
import { RealTimeTickets } from '@/components/ticket/RealTimeTickets'
import Link from 'next/link'

export default async function AdminGlobalTicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, employee:employee_id(id,full_name), technician:technician_id(id,full_name)')
    .order('created_at', { ascending: false })

  const { data: technicians } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'technician')
    .eq('status', 'approved')

  const allTickets = (tickets ?? []) as Ticket[]
  const stats = {
    open: allTickets.filter(t => t.status === 'open' || t.status === 'new').length,
    inProgress: allTickets.filter(t => t.status === 'in_progress').length,
    resolved: allTickets.filter(t => t.status === 'resolved').length,
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
              {(tickets ?? []).map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-900">{ticket.title}</p>
                    <p className="text-[10px] font-mono text-gray-400 uppercase">#{ticket.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-gray-700">{(ticket.employee as any)?.full_name ?? '—'}</span>
                  </td>
                  <td className="px-6 py-5"><StatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-5">
                    <AssignButton 
                      ticketId={ticket.id} 
                      technicians={technicians ?? []} 
                      currentTechnicianId={ticket.technician_id} 
                    />
                  </td>
                  <td className="px-6 py-5 text-[10px] text-gray-400 font-bold uppercase">
                    {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
