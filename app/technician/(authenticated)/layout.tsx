import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { SignOutButton } from '@/components/layout/SignOutButton'
import { TicketSearch } from '@/components/layout/TicketSearch'

export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'technician') redirect('/admin/tickets')

  return (
    <div className="flex flex-1">
      <Sidebar role="technician" userName={profile?.full_name} userAvatar={profile?.avatar_url} />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-100">
          <h2 className="text-lg font-bold text-primary">Espace Technicien</h2>
          <div className="flex items-center gap-4">
            <TicketSearch />
            <SignOutButton />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-50">{children}</div>
      </div>
    </div>
  )
}
