'use client'

import { useState } from 'react'
import { submitFeedback } from '@/lib/actions/tickets'

interface Props {
  ticketId: string
  existingFeedback?: { rating: number; comment: string | null } | null
}

export function FeedbackForm({ ticketId, existingFeedback }: Props) {
  const [rating, setRating] = useState(existingFeedback?.rating ?? 0)
  const [comment, setComment] = useState(existingFeedback?.comment ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(!!existingFeedback)
  const [error, setError] = useState<string | null>(null)

  if (done) {
    return (
      <div className="rounded-2xl bg-primary p-6 text-white shadow-xl">
        <h3 className="text-lg font-bold mb-2">Merci pour votre retour !</h3>
        <div className="flex gap-1 mb-3 text-2xl">
          {[1, 2, 3, 4, 5].map(star => (
            <span key={star} className={star <= rating ? 'text-white' : 'text-white/30'}>
              ★
            </span>
          ))}
        </div>
        {comment && <p className="text-sm text-blue-50 leading-relaxed italic">"{comment}"</p>}
      </div>
    )
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Veuillez sélectionner une note.')
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await submitFeedback(ticketId, rating, comment)
    if (result?.error) {
      setError(result.error)
      setSubmitting(false)
    } else {
      setDone(true)
    }
  }

  return (
    <div className="rounded-2xl bg-primary p-6 text-white shadow-xl animate-in fade-in duration-500">
      <h3 className="text-lg font-bold mb-1">Votre avis nous intéresse</h3>
      <p className="text-sm text-blue-100 mb-6">Comment évaluez-vous la résolution de ce ticket ?</p>

      <div className="space-y-5">
        {/* Sélection de la note */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-all hover:scale-110 active:scale-95
                ${star <= rating ? 'text-white' : 'text-white/30'}`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Commentaire */}
        <div className="relative">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="Un commentaire additionnel ?"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 focus:ring-4 focus:ring-white/10 transition-all resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-200 bg-red-500/20 rounded-lg px-3 py-2">{error}</p>}

        {/* Bouton d'envoi */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-xl bg-white px-6 py-4 text-sm font-black text-primary shadow-lg hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          {submitting ? 'Envoi...' : "Envoyer l'évaluation"}
        </button>
      </div>
    </div>
  )
}