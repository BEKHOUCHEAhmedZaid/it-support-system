import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const { headers } = await import('next/headers')
  const headerList = await headers()
  const pathname = headerList.get('x-pathname') || ''

  // Hide global header inside authenticated dashboards to avoid duplicate navigation
  const isDashboard = pathname.startsWith('/admin') || 
                      pathname.startsWith('/technician') || 
                      pathname.startsWith('/client')

  if (isDashboard && user && profile) {
    return null
  }

  // Define dashboard link based on role
  const getDashboardLink = () => {
    if (!profile) return '/client/tickets'
    switch (profile.role) {
      case 'admin': return '/admin/tickets'
      case 'technician': return '/technician/tickets'
      default: return '/client/tickets'
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 sm:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-all">
            <Image src="/logo.png" alt="IT-Fix" width={22} height={22} className="brightness-0 invert" />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">IT‑Fix</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link href="/#features" className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-primary transition-colors">Fonctionnalités</Link>
          <Link href="/#about" className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-primary transition-colors">À propos</Link>
          
          {/* Show System Admin only if admin */}
          {profile?.role === 'admin' ? (
            <Link href="/admin/tickets" className="text-[10px] font-black text-purple-600 uppercase tracking-widest border border-purple-100 bg-purple-50 px-3 py-1 rounded-full">System Admin</Link>
          ) : !user && (
            <Link href="/admin/login" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">Support</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href={getDashboardLink()}
              className="inline-flex items-center rounded-xl bg-gray-900 px-6 py-3 text-xs font-black text-white shadow-xl shadow-gray-200 hover:bg-black hover:-translate-y-0.5 transition-all"
            >
              Tableau de bord
            </Link>
          ) : (
            <>
              <Link
                href="/client/login"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-gray-600 hover:text-primary transition-all"
              >
                Connexion
              </Link>
              <Link
                href="/client/login"
                className="inline-flex items-center rounded-xl bg-primary px-6 py-3 text-xs font-black text-white shadow-xl shadow-blue-100 hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
              >
                Commencer
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
