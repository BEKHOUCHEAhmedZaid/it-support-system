import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Ticket } from '@/lib/types'
import { TicketCard } from '@/components/ticket/TicketCard'
import { TicketFilterUI } from '@/components/ticket/TicketFilterUI'
import { RealTimeTickets } from '@/components/ticket/RealTimeTickets'

export default async function ClientTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const params = await searchParams
  // Clients see ONLY their own tickets
  let query = supabase
    .from('tickets')
    .select('*, technician:technician_id(id,full_name,role,avatar_url)')
    .eq('employee_id', user.id)
    .order('created_at', { ascending: false })

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  if (params.status) {
    query = query.eq('status', params.status)
  }

  const { data: tickets } = await query

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <RealTimeTickets />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mes Demandes</h1>
          <p className="text-sm text-gray-500 mt-1">Suivez l&apos;évolution de vos tickets de support.</p>
        </div>
        <Link 
          href="/client/tickets/new" 
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Nouveau Ticket
        </Link>
      </div>

      <TicketFilterUI />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(tickets ?? []).map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket as Ticket} role="client" />
        ))}
      </div>

      {(tickets ?? []).length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/></svg>
          </div>
          <p className="text-gray-500 font-medium">Vous n&apos;avez pas encore créé de ticket.</p>
          <Link href="/client/tickets/new" className="text-primary font-bold text-sm mt-2 inline-block hover:underline">Signaler un problème maintenant</Link>
        </div>
      )}
    </div>
  )
}
