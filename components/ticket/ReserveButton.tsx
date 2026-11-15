'use client'
import { useState } from 'react'
import { assignTicket } from '@/lib/actions/tickets'

interface Props {
  ticketId: string
  onAssigned?: () => void
}

export function ReserveButton({ ticketId, onAssigned }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReserve = async () => {
    console.log('[ReserveButton] Prise en charge du ticket:', ticketId)
    setLoading(true)
    setError(null)

    try {
      const result = await assignTicket(ticketId)
      console.log('[ReserveButton] Résultat assignation:', result)

      if (result?.error) {
        setError(result.error)
      } else {
        if (onAssigned) {
          onAssigned()
        }
      }
    } catch (e: any) {
      console.error('[ReserveButton] Erreur inattendue:', e)
      const code = e?.code ? `[${e.code}] ` : ''
      setError(`${code}${e?.message || 'Une erreur inattendue est survenue lors de la prise en charge.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleReserve}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-xl shadow-blue-200 hover:bg-primary-dark transition-all disabled:opacity-50"
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            RESERVER CE TICKET
          </>
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 shadow-sm animate-in fade-in duration-200">
          ⚠️ Échec de la réservation : {error}
        </div>
      )}
    </div>
  )
}
