'use client'
import { useState, useEffect } from 'react'
import { createTicket } from '@/lib/actions/tickets'
import { collectSystemInfo } from '@/lib/system-info'
import { Input }            from '@/components/ui/Input'
import { Textarea }         from '@/components/ui/Textarea'
import { Select }           from '@/components/ui/Select'
import { ScreenshotUpload } from '@/components/ticket/ScreenshotUpload'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'Réseau',   label: 'Réseau'   },
  { value: 'Logiciel', label: 'Logiciel' },
  { value: 'Matériel', label: 'Matériel' },
  { value: 'Autre',    label: 'Autre'    },
]

const PRIORITIES = [
  { value: 'bloquant', label: 'Bloquant' },
  { value: 'haute',    label: 'Haute'    },
  { value: 'normale',  label: 'Normale'  },
]

export function NewTicketForm({ userId }: { userId: string }) {
  const [screenshotUrl, setScreenshotUrl] = useState<string>('')
  const [submitting, setSubmitting]       = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [systemInfo, setSystemInfo] = useState('')

  useEffect(() => {
    try {
      const info = collectSystemInfo()
      // Format as readable text instead of raw JSON
      const text = `OS: ${info.platform}\nNavigateur: ${info.userAgent}\nÉcran: ${info.screenWidth}x${info.screenHeight}\nLangue: ${info.language}`
      setSystemInfo(text)
    } catch {}
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('screenshot_url', screenshotUrl)
    fd.set('system_info', systemInfo)
    const result = await createTicket(fd)
    if (result?.error) { setError(result.error); setSubmitting(false) }
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <Link href="/client/tickets" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 mb-4">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Retour à la liste
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nouveau ticket</h1>
        <p className="text-sm text-gray-500 mt-2">Décrivez votre problème avec précision pour une résolution rapide.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-100/50 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center text-sm">1</span>
              Détails du problème
            </h2>
            <Input 
              id="title" 
              name="title" 
              label="Titre du problème" 
              required 
              placeholder="Ex: Problème de connexion au VPN Bureau" 
              className="bg-gray-50 border-gray-100 focus:bg-white"
            />
            <Textarea 
              id="description" 
              name="description" 
              label="Description détaillée" 
              required 
              rows={5}
              placeholder="Décrivez précisément ce qui se passe..." 
              className="bg-gray-50 border-gray-100 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center text-sm">2</span>
                Classification
              </h2>
              <Select id="category" name="category" label="Catégorie" options={CATEGORIES} className="bg-gray-50" />
              <Select id="priority" name="priority" label="Priorité" options={PRIORITIES} className="bg-gray-50" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center text-sm">3</span>
                Preuve visuelle
              </h2>
              <ScreenshotUpload userId={userId} onUploaded={setScreenshotUrl} />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 space-y-4">
            <Input 
              id="system_info" 
              name="system_info" 
              label="Infos système collectées (modifiable)" 
              value={systemInfo}
              onChange={(e) => setSystemInfo(e.target.value)}
              placeholder="Détails de votre ordinateur/navigateur"
              className="bg-gray-50"
            />

            <div className="flex items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Infos système incluses
              </div>

              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

              <button 
                type="submit" 
                disabled={submitting}
                className="inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                ) : (
                  'Soumettre le ticket'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
