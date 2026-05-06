import type { TicketPriority } from '@/lib/types'

const MAP: Record<TicketPriority, { label: string; className: string }> = {
  bloquant: { label: 'URGENT',  className: 'bg-red-500 text-white' },
  haute:    { label: 'HAUTE',   className: 'bg-orange-500 text-white' },
  normale:  { label: 'NORMAL',  className: 'bg-blue-100 text-blue-700' },
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const { label, className } = MAP[priority] ?? MAP.normale
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${className}`}>
      {priority === 'bloquant' && <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />}
      {label}
    </span>
  )
}
