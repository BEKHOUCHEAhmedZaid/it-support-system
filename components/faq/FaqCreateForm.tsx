'use client'
import { useState } from 'react'
import { createFaqArticle } from '@/lib/actions/faq'
import { Input }    from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select }   from '@/components/ui/Select'

const CATEGORIES = [
  { value: '',        label: 'Choisir une catégorie' },
  { value: 'Réseau',  label: 'Réseau'   },
  { value: 'Logiciel',label: 'Logiciel' },
  { value: 'Matériel',label: 'Matériel' },
  { value: 'Autre',   label: 'Autre'    },
]

interface Props {
  prefill?: { title?: string; content?: string; category?: string }
}

export function FaqCreateForm({ prefill = {} }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await createFaqArticle(fd)
    if (result?.error) { setError(result.error); setSubmitting(false); return }
    setSuccess(true)
    setSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8 text-center animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-900">Article publié !</h3>
        <p className="text-sm text-emerald-700 mt-1 mb-6">L&apos;article est maintenant visible dans la base de connaissances.</p>
        <button 
          type="button" 
          onClick={() => setSuccess(false)} 
          className="rounded-xl bg-white border border-emerald-200 px-6 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          Ajouter un autre article
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <Input 
          id="faq-title" 
          name="title" 
          label="Titre de l'article" 
          required 
          defaultValue={prefill.title ?? ''} 
          placeholder="Ex: Configurer l'accès VPN sur macOS" 
          className="bg-gray-50 border-gray-100 focus:bg-white"
        />
        <Textarea 
          id="faq-content" 
          name="content" 
          label="Contenu de la solution" 
          required 
          rows={6} 
          defaultValue={prefill.content ?? ''} 
          placeholder="Expliquez la démarche étape par étape..." 
          className="bg-gray-50 border-gray-100 focus:bg-white"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select id="faq-category" name="category" label="Catégorie" options={CATEGORIES} defaultValue={prefill.category ?? ''} className="bg-gray-50" />
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all group">
              <input type="checkbox" id="is_public" name="is_public" value="true" defaultChecked className="h-5 w-5 rounded-lg border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer" />
              <div>
                <p className="text-sm font-bold text-gray-700">Rendre public</p>
                <p className="text-[10px] text-gray-400 font-medium">Visible par tous les employés immédiatement</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

      <button 
        type="submit" 
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-10 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
      >
        {submitting ? (
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
        ) : (
          'Publier l\'article'
        )}
      </button>
    </form>
  )
}
