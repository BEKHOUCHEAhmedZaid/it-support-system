import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { SignOutButton } from '@/components/layout/SignOutButton'
import { TicketSearch } from '@/components/layout/TicketSearch'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  // Allow both 'client' and legacy 'employee' roles for now
  if (profile?.role !== 'client' && profile?.role !== 'employee' && profile?.role !== 'admin') redirect('/technician/tickets')

  return (
    <div className="flex flex-1">
      <Sidebar role="client" userName={profile?.full_name} userAvatar={profile?.avatar_url} />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
             <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Espace Client</h2>
          </div>
          <div className="flex items-center gap-4">
            <TicketSearch />
            <SignOutButton />
          </div>
        </div>
        <main className="flex-1 p-6 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  )
}
