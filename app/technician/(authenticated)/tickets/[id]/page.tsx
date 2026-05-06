import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import type { Ticket, SystemInfo } from '@/lib/types'
import { StatusBadge }        from '@/components/ui/StatusBadge'
import { PriorityBadge }      from '@/components/ui/PriorityBadge'
import { ChatSection }        from '@/components/ticket/ChatSection'
import { SystemInfoDisplay }  from '@/components/ticket/SystemInfoDisplay'
import { ResolveTicketForm }  from '@/components/ticket/ResolveTicketForm'
import { ReserveButton }      from '@/components/ticket/ReserveButton'
import Link from 'next/link'

export default async function TechnicianTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, employee:employee_id(id,full_name,role,avatar_url), technician:technician_id(id,full_name,role,avatar_url)')
    .eq('id', id)
    .single()

  if (!ticket) notFound()

  const { data: messages } = await supabase
    .from('messages')
    .select('*, sender:sender_id(id,full_name,role,avatar_url)')
    .eq('ticket_id', id)
    .order('created_at', { ascending: true })

  const { data: feedbackData } = await supabase
    .from('feedback')
    .select('*')
    .eq('ticket_id', id)
    .maybeSingle()

  const t = ticket as Ticket
  const isMyTicket = t.technician_id === user.id
  const isUnassigned = !t.technician_id

  // Build FAQ prefill URL query
  const faqPrefill = encodeURIComponent(JSON.stringify({
    title:    t.title,
    content:  t.resolution ?? '',
    category: t.category,
  }))

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <Link href="/technician/tickets" className="hover:text-primary transition-colors">Espace Technicien</Link>
        <span>&gt;</span>
        <span className="text-gray-900">{t.id.slice(0, 8).toUpperCase()}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm overflow-hidden shrink-0">
            {t.employee?.avatar_url ? (
              <img src={t.employee.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Posté par <span className="text-gray-900 font-bold">{(t.employee as any)?.full_name}</span>
              {' · '} {new Date(t.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} à {new Date(t.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={t.status} />
          <PriorityBadge priority={t.priority} />
        </div>
      </div>

      {isUnassigned && (
        <div className="flex items-center gap-4 rounded-3xl bg-blue-50/50 border border-blue-100 p-6 animate-in zoom-in duration-500">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p className="flex-1 text-sm font-bold text-gray-900 tracking-tight">Ce ticket est en attente d&apos;assignation. Prenez-le en charge pour commencer.</p>
          <ReserveButton ticketId={id} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </span>
              <h2 className="text-lg font-bold text-gray-900">Description du problème</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{t.description}</p>
          </div>

          {t.screenshot_url && (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </span>
                Capture d&apos;écran
              </h2>
              <div className="rounded-2xl overflow-hidden border border-gray-50 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.screenshot_url} alt="Bug screenshot" className="w-full max-h-[500px] object-contain mx-auto" />
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
            <ChatSection
              ticketId={id}
              currentUserId={user.id}
              initialMessages={(messages ?? []) as Parameters<typeof ChatSection>[0]['initialMessages']}
            />
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Resolve Ticket Form */}
          {isMyTicket && t.status === 'in_progress' && (
            <ResolveTicketForm ticketId={id} />
          )}

          {/* Already Resolved State */}
          {t.status === 'resolved' && (
            <div className="rounded-3xl bg-emerald-50/50 border border-emerald-100 p-8 shadow-xl shadow-emerald-500/5">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
                <h3 className="text-lg font-black text-emerald-900 leading-tight">Ticket Résolu</h3>
              </div>
              <p className="text-sm text-emerald-700 leading-relaxed font-medium">{t.resolution}</p>
              <div className="mt-8 pt-6 border-t border-emerald-100/50 flex flex-col gap-4">
                <Link
                  href={`/technician/faq?prefill=${faqPrefill}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-emerald-200 px-6 py-3 text-[11px] font-black text-emerald-700 uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                  Ajouter à la FAQ
                </Link>
                {feedbackData && (
                  <div className="pt-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Note de l&apos;employé</p>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl text-amber-400">{'★'.repeat(feedbackData.rating)}{'☆'.repeat(5 - feedbackData.rating)}</div>
                      {feedbackData.comment && <p className="text-xs text-gray-500 italic leading-relaxed">&quot;{feedbackData.comment}&quot;</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Info */}
          <SystemInfoDisplay info={t.system_info as SystemInfo} />
          
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
            <h3 className="text-base font-bold text-gray-900 mb-6">Résumé administratif</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase">Ticket ID</span>
                <span className="text-xs font-mono text-gray-900 font-bold bg-gray-50 px-2 py-1 rounded">#{t.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase">Catégorie</span>
                <span className="text-xs font-bold text-primary bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">{t.category}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Temps écoulé</span>
                <span className="text-xs font-bold text-gray-900 italic">2h 14m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
