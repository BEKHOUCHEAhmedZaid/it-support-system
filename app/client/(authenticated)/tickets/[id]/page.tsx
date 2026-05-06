import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Ticket, SystemInfo } from '@/lib/types'
import { StatusBadge }       from '@/components/ui/StatusBadge'
import { PriorityBadge }     from '@/components/ui/PriorityBadge'
import { ChatSection }       from '@/components/ticket/ChatSection'
import { FeedbackForm }      from '@/components/ticket/FeedbackForm'
import { SystemInfoDisplay } from '@/components/ticket/SystemInfoDisplay'

export default async function EmployeeTicketDetailPage({
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <Link href="/client/tickets" className="hover:text-primary transition-colors">Mes Demandes</Link>
        <span>&gt;</span>
        <span className="text-gray-900">{t.id.slice(0, 8).toUpperCase()}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Créé le {new Date(t.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} à {new Date(t.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={t.status} />
          <PriorityBadge priority={t.priority} />
        </div>
      </div>

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
          {/* Resolution Card */}
          {t.status === 'resolved' && t.resolution && (
            <div className="rounded-3xl bg-emerald-50/50 border border-emerald-100 p-8 shadow-xl shadow-emerald-500/5 animate-in zoom-in duration-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
                <h3 className="text-lg font-black text-emerald-900 leading-tight">Problème Résolu</h3>
              </div>
              <p className="text-sm text-emerald-700 leading-relaxed font-medium">{t.resolution}</p>
              {t.resolved_at && (
                <p className="mt-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Clôturé le {new Date(t.resolved_at).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          )}

          {/* Feedback Form */}
          {t.status === 'resolved' && !feedbackData && (
           <FeedbackForm ticketId={id} existingFeedback={null} />
          )}

          {/* Technician Info */}
          {t.technician && (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
              <h3 className="text-base font-bold text-gray-900 mb-6">Technicien assigné</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary font-bold overflow-hidden">
                  {t.technician.avatar_url ? (
                    <img src={t.technician.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    t.technician.full_name?.[0]?.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.technician.full_name}</p>
                  <p className="text-xs text-gray-400 font-medium capitalize">{t.technician.role}</p>
                </div>
              </div>
            </div>
          )}

          <SystemInfoDisplay info={t.system_info as SystemInfo} />
          
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/30">
            <h3 className="text-base font-bold text-gray-900 mb-6">Détails du ticket</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase">ID</span>
                <span className="text-xs font-mono text-gray-900 font-bold bg-gray-50 px-2 py-1 rounded">#{t.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase">Catégorie</span>
                <span className="text-xs font-bold text-primary bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">{t.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
