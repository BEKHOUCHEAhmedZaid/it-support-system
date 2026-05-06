import type { TicketStatus } from '@/lib/types'

const MAP: Record<TicketStatus, { label: string; className: string; icon: string }> = {
  new:         { label: 'Nouveau',   className: 'bg-blue-50 text-blue-700 border-blue-200',     icon: '◇' },
  in_progress: { label: 'En cours',  className: 'bg-amber-50 text-amber-700 border-amber-200',  icon: '◔' },
  resolved:    { label: 'Résolu',    className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✓' },
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, className, icon } = MAP[status] ?? MAP.new
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
      <span>{icon}</span>
      {label}
    </span>
  )
}
