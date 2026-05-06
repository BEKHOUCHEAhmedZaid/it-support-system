'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { Role } from '@/lib/types'
import { SignOutButton } from './SignOutButton'

interface NavItem { label: string; href: string; icon: React.ReactNode; }

const TicketIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/></svg>
const NewIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
const FaqIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
const MsgIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
const UsersIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
const SettingsIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.431.992l1.003.827a1.125 1.125 0 01.26 1.43l-1.296 2.247a1.125 1.125 0 01-1.37.491l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.222-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>

const ProfileIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/></svg>

const CLIENT_NAV: NavItem[] = [
  { label: 'Mes demandes',   href: '/client/tickets',      icon: TicketIcon },
  { label: 'Messages',       href: '/client/messages',     icon: MsgIcon },
  { label: 'Nouveau ticket', href: '/client/tickets/new',  icon: NewIcon },
  { label: 'FAQ',            href: '/client/faq',          icon: FaqIcon },
  { label: 'Mon Profil',     href: '/client/profile',      icon: ProfileIcon },
]

const TECHNICIAN_NAV: NavItem[] = [
  { label: 'Mes missions',    href: '/technician/tickets',  icon: TicketIcon },
  { label: 'Messages',        href: '/technician/messages', icon: MsgIcon },
  { label: 'FAQ',             href: '/technician/faq',      icon: FaqIcon },
  { label: 'Mon Profil',      href: '/technician/profile',  icon: ProfileIcon },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'Tickets Globaux', href: '/admin/tickets',      icon: TicketIcon },
  { label: 'Utilisateurs',    href: '/admin/users',        icon: UsersIcon },
  { label: 'Techniciens',     href: '/admin/technicians',  icon: SettingsIcon },
  { label: 'FAQ System',      href: '/admin/faq',          icon: FaqIcon },
  { label: 'Mon Profil',      href: '/admin/profile',      icon: ProfileIcon },
]

interface Props {
  role: Role
  userName?: string
  userAvatar?: string | null
}

export function Sidebar({ role, userName, userAvatar }: Props) {
  const pathname = usePathname()
  
  let nav = CLIENT_NAV
  if (role === 'technician') nav = TECHNICIAN_NAV
  if (role === 'admin') nav = ADMIN_NAV

  const getRoleLabel = () => {
    if (role === 'admin') return 'Administrateur'
    if (role === 'technician') return 'Technicien'
    return 'Client'
  }

  const getStatusColor = () => {
    if (role === 'admin') return 'bg-purple-400'
    if (role === 'technician') return 'bg-emerald-400'
    return 'bg-blue-400'
  }

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-sidebar text-white shadow-2xl">
      {/* Brand */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center group mb-6">
          <img src="/logo.png" alt="IT-Fix Logo" className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
        </Link>
        <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.2em] opacity-60">
          {role === 'admin' ? 'Système' : role === 'technician' ? 'Support' : 'Interface'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {nav.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200
                ${isActive
                  ? 'bg-primary text-white shadow-xl shadow-blue-500/30 translate-x-1'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span className={isActive ? 'scale-110' : ''}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User profile at bottom */}
      <div className="p-4 bg-slate-900/50 mt-auto border-t border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-black text-white shrink-0 overflow-hidden">
            {userAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              (userName?.[0] ?? '?').toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{userName ?? 'Utilisateur'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor()} animate-pulse`} />
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">{getRoleLabel()}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800/50">
          <SignOutButton />
        </div>
      </div>
    </aside>
  )
}
