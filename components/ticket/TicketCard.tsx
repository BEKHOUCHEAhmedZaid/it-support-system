import Link from 'next/link'
import type { Ticket, Role } from '@/lib/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PriorityBadge } from '@/components/ui/PriorityBadge'

interface Props {
  ticket: Ticket
  role: Role
}

export function TicketCard({ ticket, role }: Props) {
  let href = `/client/tickets/${ticket.id}`
  if (role === 'admin') href = `/admin/tickets/${ticket.id}`
  if (role === 'technician') href = `/technician/tickets/${ticket.id}`

  return (
    <Link href={href} className="block group">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-blue-200 hover:shadow-md transition-all">
        {/* Top row: priority + ticket id + status + date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={ticket.priority} />
            <span className="text-xs font-mono text-gray-400">#{ticket.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={ticket.status} />
            <span className="text-xs text-gray-400">
              {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Title + description */}
        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary">{ticket.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{ticket.description}</p>

        {/* Bottom row: category + agent + link */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
              {ticket.category}
            </span>
            {ticket.technician && (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Agent: {(ticket.technician as unknown as { full_name: string }).full_name}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-primary group-hover:underline">
            Voir les détails →
          </span>
        </div>
      </div>
    </Link>
  )
}
