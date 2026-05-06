import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavbarClient } from './NavbarClient'

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
    <NavbarClient 
      user={user} 
      profile={profile} 
      dashboardLink={getDashboardLink()} 
    />
  )
}
