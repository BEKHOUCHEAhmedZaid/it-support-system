import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Ticket, Message } from '@/lib/types'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface Props {
  role: 'employee' | 'technician'
  userId: string
}

export async function MessageCenter({ role, userId }: Props) {
  const supabase = await createClient()

  // Get tickets where the user is involved and has messages
  let query = supabase
    .from('tickets')
    .select(`
      *,
      employee:employee_id(id, full_name, avatar_url),
      technician:technician_id(id, full_name, avatar_url),
      messages!inner(id, content, created_at, sender_id)
    `)
    .order('created_at', { foreignTable: 'messages', ascending: false })

  if (role === 'employee') {
    query = query.eq('employee_id', userId)
  } else {
    query = query.eq('technician_id', userId)
  }

  const { data: tickets } = await query
  const ticketList = (tickets ?? []) as any[]

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Centre de messagerie</h1>
        <p className="text-sm text-gray-500 mt-1">Consultez et répondez à toutes vos conversations actives.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {ticketList.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center bg-white">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Aucune conversation</h3>
            <p className="text-sm text-gray-400 mt-1">Vos messages apparaîtront ici dès que vous aurez des échanges sur vos tickets.</p>
          </div>
        ) : (
          ticketList.map(ticket => {
            const lastMsg = ticket.messages[0] as Message
            const otherParty = role === 'employee' ? ticket.technician : ticket.employee
            const href = role === 'employee' ? `/admin/tickets/${ticket.id}` : `/technician/tickets/${ticket.id}`

            return (
              <Link key={ticket.id} href={href} className="group block">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-primary font-bold overflow-hidden border border-gray-100">
                        {otherParty?.avatar_url ? (
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
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest whitespace-nowrap">
                      {new Date(lastMsg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  
                  <div className="mt-4 bg-gray-50 rounded-xl p-4 relative group-hover:bg-blue-50/50 transition-colors">
                    <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-50 rotate-45 border-l border-t border-transparent group-hover:bg-blue-50/50 transition-colors" />
                    <p className="text-sm text-gray-600 line-clamp-1 italic">
                      &quot;{lastMsg.content}&quot;
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-end text-xs font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                    Répondre →
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
