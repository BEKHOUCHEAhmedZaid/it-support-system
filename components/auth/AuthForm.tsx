'use client'

import { useState } from 'react'
import type { Role } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { signIn, signUp, getRedirectPath } from '@/lib/actions/auth'
import { Input }  from '@/components/ui/Input'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export function AuthForm({ role }: { role: Role }) {
  const [mode, setMode]         = useState<'login' | 'signup'>('login')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState<string | null>(null)

  const roleLabel = role === 'admin' ? 'Administrateur' : role === 'technician' ? 'Technicien' : 'Client'

  // Image logic
  const getIllustration = () => {
    if (role === 'technician') return 'https://images.pexels.com/photos/36548137/pexels-photo-36548137.jpeg'
    if (role === 'client') return 'https://i.pinimg.com/736x/cf/cc/58/cfcc581c39ea6b5980534c2f923c8615.jpg'
    // Admin fallback
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
  }

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
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-blue-500/30">
      
      {/* ─── LEFT PANEL (FORM) ───────────────────────────────────────────────── */}
      <div className="relative flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-32">
        {/* Back Link */}
        <Link 
          href="/" 
          className="absolute top-8 left-6 sm:left-12 lg:left-20 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour au site
        </Link>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Logo */}
          <div className="mb-12">
            <img 
              src="/logo.png" 
              alt="IT-Fix Logo" 
              className="h-10 sm:h-12 w-auto object-contain" 
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            {mode === 'login' ? 'Bon retour' : 'Créer un compte'}
          </h1>
          <p className="text-slate-500 font-medium mb-10">
            Espace sécurisé pour <span className="text-blue-600 font-bold">{roleLabel}</span>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Input
                    id="full_name"
                    name="full_name"
                    label="Nom complet"
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    className="bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <Input
              id="email"
              name="email"
              label="Adresse e-mail"
              type="email"
              required
              placeholder="votre@entreprise.com"
              className="bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all shadow-sm"
            />
            <Input
              id="password"
              name="password"
              label="Mot de passe"
              type="password"
              required
              placeholder="••••••••"
              className="bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all shadow-sm"
            />

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl bg-red-50 border border-red-100 p-4"
                >
                  <p className="text-xs text-red-600 font-bold flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                    {error}
                  </p>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl bg-emerald-50 border border-emerald-100 p-4"
                >
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    {success}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-black text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              ) : (
                <>
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
              className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              {mode === 'login' ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* ─── RIGHT PANEL (ILLUSTRATION) ───────────────────────────────────────── */}
      <div className="hidden lg:block relative w-full h-full bg-slate-900 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img 
            src={getIllustration()} 
            alt="Authentication background" 
            className="w-full h-full object-cover object-center opacity-90"
          />
          {/* Gradient Overlay for text legibility and premium feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/40 to-transparent" />
        </motion.div>

        {/* Floating Accent Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

        {/* Testimonial / Branding Overlay */}
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl"
          >
            <div className="flex gap-1 mb-6 text-blue-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-6">
              "La plateforme a complètement révolutionné notre façon de gérer les incidents. L'expérience est ultra-fluide et les résolutions sont instantanées."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                JD
              </div>
              <div>
                <p className="text-white font-bold">Jean Dupont</p>
                <p className="text-slate-300 text-sm">Directeur IT, TechFlow</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
