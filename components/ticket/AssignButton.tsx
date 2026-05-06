'use client'
import { useState } from 'react'
import { assignTicket } from '@/lib/actions/admin'
import type { Profile } from '@/lib/types'

interface Props {
  ticketId: string
  technicians: Profile[]
  currentTechnicianId: string | null
}

export function AssignButton({ ticketId, technicians, currentTechnicianId }: Props) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const techId = e.target.value
    if (!techId) return

    setLoading(true)
    await assignTicket(ticketId, techId)
    setLoading(false)
  }

  return (
    <div className="relative">
      <select
        defaultValue={currentTechnicianId ?? ''}
        disabled={loading}
        onChange={handleChange}
        className="text-[10px] font-bold bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 appearance-none pr-6"
      >
        <option value="" disabled>Assigner...</option>
        {technicians.map(tech => (
          <option key={tech.id} value={tech.id}>
            {tech.full_name}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </div>
      {loading && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2">
           <svg className="animate-spin h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
        </div>
      )}
    </div>
  )
}
