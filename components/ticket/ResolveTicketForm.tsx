'use client'
import { useState } from 'react'
import { resolveTicket } from '@/lib/actions/tickets'
import { Textarea } from '@/components/ui/Textarea'

export function ResolveTicketForm({ ticketId }: { ticketId: string }) {
  const [resolution, setResolution] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!resolution.trim()) { setError('Veuillez décrire la solution appliquée.'); return }
    setSubmitting(true)
    const result = await resolveTicket(ticketId, resolution.trim())
    if (result?.error) { setError(result.error); setSubmitting(false) }
  }

  return (
    <div className="rounded-3xl bg-emerald-50/50 border border-emerald-100 p-8 shadow-xl shadow-emerald-500/5 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <span className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl text-emerald-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </span>
        <div>
          <h3 className="text-lg font-black text-emerald-900 leading-tight">Marquer comme résolu</h3>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">Décrivez la solution pour clôturer ce ticket.</p>
        </div>
      </div>

      <div className="space-y-5">
        <Textarea
          label="Résumé de la résolution"
          value={resolution}
          onChange={e => setResolution(e.target.value)}
          rows={5}
          placeholder="Ex: Mise à jour du client VPN effectuée. La connexion est maintenant stable..."
          className="bg-white border-emerald-100 focus:border-emerald-300 focus:ring-emerald-50"
        />
        
        {error && <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

        <button 
          onClick={handleSubmit} 
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-emerald-100 hover:bg-emerald-600 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
        >
          {submitting ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
          ) : (
            'Clôturer le ticket'
          )}
        </button>
      </div>
    </div>
  )
}
