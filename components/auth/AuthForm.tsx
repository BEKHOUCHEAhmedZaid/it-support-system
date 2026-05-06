'use client'
import { useState } from 'react'
import type { Role } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { signIn, signUp, getRedirectPath } from '@/lib/actions/auth'
import { Input }  from '@/components/ui/Input'
import Image from 'next/image'

export function AuthForm({ role }: { role: Role }) {
  const [mode, setMode]         = useState<'login' | 'signup'>('login')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState<string | null>(null)

  const roleLabel = role === 'admin' ? 'Administrateur' : role === 'technician' ? 'Technicien' : 'Client'

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const fd = new FormData(e.currentTarget)
    const result = mode === 'login'
      ? await signIn(fd, role)
      : await signUp(fd, role)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Success
      if (mode === 'signup') {
        setSuccess("Compte créé ! Vous pouvez maintenant vous connecter.")
        setMode('login')
        setLoading(false)
      } else {
        // Redirection based on the role RETURNED by DB
        const redirectRole = (result as any).role || role
        router.push(getRedirectPath(redirectRole))
        router.refresh()
      }
    }
  }

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-2xl shadow-blue-100/50 relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Image src="/logo.png" alt="IT-Fix" width={40} height={40} className="rounded-lg" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 text-center tracking-tight">
            {mode === 'login' ? 'Bon retour !' : 'Rejoignez-nous'}
          </h1>
          <p className="text-sm text-gray-400 text-center mt-2 mb-8 font-medium">
            Accès sécurisé · Espace <span className="text-primary font-bold">{roleLabel}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <Input
                id="full_name"
                name="full_name"
                label="Nom complet"
                type="text"
                required
                placeholder="Jean Dupont"
                className="bg-gray-50 border-gray-100"
              />
            )}
            <Input
              id="email"
              name="email"
              label="Adresse e-mail"
              type="email"
              required
              placeholder="votre@entreprise.com"
              className="bg-gray-50 border-gray-100"
            />
            <Input
              id="password"
              name="password"
              label="Mot de passe"
              type="password"
              required
              placeholder="••••••••"
              className="bg-gray-50 border-gray-100"
            />

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 animate-shake">
                <p className="text-xs text-red-600 font-bold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 animate-in fade-in zoom-in">
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  {success}
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              ) : (
                mode === 'login' ? 'Se connecter' : 'Créer un compte'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
              className="text-sm font-bold text-gray-400 hover:text-primary transition-colors"
            >
              {mode === 'login' ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
            </button>
            <Link href="/" className="text-xs font-bold text-gray-300 hover:text-gray-500 flex items-center gap-1 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
