import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* ─── NAVBAR ──────────────────────────────────── */}

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-32 bg-white overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #2563EB 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        <div className="relative z-10 flex flex-col items-center max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-[10px] font-black text-primary mb-8 uppercase tracking-[0.2em]">
            Support IT Pro · Version 2.0
          </span>

          <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-gray-900 leading-[1.1]">
            Votre support technique,<br />
            <span className="text-primary italic">réinventé.</span>
          </h1>

          <p className="mt-8 text-xl text-gray-500 leading-relaxed max-w-2xl font-medium">
            IT‑Fix connecte vos employés aux meilleurs techniciens pour une résolution rapide et transparente de tous vos incidents informatiques.
          </p>

          {/* CTA Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-14 w-full max-w-2xl">
            <Link
              href="/client/login"
              className="group flex items-center gap-4 rounded-3xl bg-white border-2 border-blue-100 p-6 text-left shadow-xl shadow-blue-50/50 hover:border-primary hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60">Utilisateur</p>
                <h3 className="text-xl font-black text-gray-900">Espace Client</h3>
                <p className="text-xs text-gray-400 mt-1">Signalez vos problèmes IT</p>
              </div>
            </Link>

            <Link
              href="/technician/login"
              className="group flex items-center gap-4 rounded-3xl bg-gray-900 border-2 border-gray-800 p-6 text-left shadow-xl shadow-gray-900/10 hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest opacity-60">Technique</p>
                <h3 className="text-xl font-black text-white">Technicien</h3>
                <p className="text-xs text-gray-500 mt-1">Gérez vos interventions</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section id="features" className="px-6 py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Pensé pour la performance</h2>
            <p className="mt-4 text-lg text-gray-500 font-medium">Des outils intuitifs qui accélèrent la résolution de vos incidents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/20 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <h3 className="text-xl font-black text-gray-900">Auto-Diagnostic</h3>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed font-medium">Capture automatique des informations système pour aider nos techniciens à comprendre le problème sans poser mille questions.</p>
            </div>

            <div className="bg-primary rounded-3xl p-8 text-white shadow-2xl shadow-blue-200 hover:scale-[1.02] transition-all">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </div>
              <h3 className="text-xl font-black">Chat Direct</h3>
              <p className="text-sm text-blue-100 mt-3 leading-relaxed font-medium">Échangez en temps réel avec le technicien assigné. Suivez chaque étape de la résolution comme si vous étiez à côté de lui.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/20 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-xl font-black text-gray-900">Suivi Garanti</h3>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed font-medium">Ne perdez jamais le fil. Notifications instantanées et historique complet pour une traçabilité parfaite de vos demandes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer className="bg-white px-6 py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Image src="/logo.png" alt="IT-Fix" width={32} height={32} className="rounded-lg" />
              <span className="text-2xl font-black text-primary tracking-tight">IT‑Fix</span>
            </div>
            <p className="text-gray-400 max-w-sm font-medium">La plateforme de support technique de nouvelle génération pour les entreprises qui exigent l&apos;excellence.</p>
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Plateforme</h4>
            <ul className="space-y-4">
              <li><Link href="/client/login" className="text-sm text-gray-500 font-bold hover:text-primary transition-colors">Espace Client</Link></li>
              <li><Link href="/technician/login" className="text-sm text-gray-500 font-bold hover:text-primary transition-colors">Espace Technicien</Link></li>
              <li><Link href="/admin/login" className="text-sm text-gray-500 font-bold hover:text-primary transition-colors">Admin Système</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/client/faq" className="text-sm text-gray-500 font-bold hover:text-primary transition-colors">Aide & FAQ</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 font-bold hover:text-primary transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">© 2024 IT‑Fix Support Technique</p>
          <div className="flex gap-4">
             <span className="text-xs font-black text-gray-400">AMINE · RAYAN · AHMED</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
