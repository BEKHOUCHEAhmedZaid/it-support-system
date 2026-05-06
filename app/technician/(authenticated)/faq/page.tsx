import { createClient }    from '@/lib/supabase/server'
import { FaqList }         from '@/components/faq/FaqList'
import { FaqCreateForm }   from '@/components/faq/FaqCreateForm'
import Link from 'next/link'

export default async function TechnicianFaqPage({
  searchParams,
}: {
  searchParams: Promise<{ prefill?: string }>
}) {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('faq_articles')
    .select('*')
    .order('created_at', { ascending: false })

  const params = await searchParams
  let prefill: { title?: string; content?: string; category?: string } = {}
  if (params.prefill) {
    try { prefill = JSON.parse(decodeURIComponent(params.prefill)) } catch {}
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          <Link href="/technician/tickets" className="hover:text-primary">Espace Technicien</Link>
          <span>&gt;</span>
          <span className="text-gray-900">Gestion de la FAQ</span>
        </nav>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Base de connaissances</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez les articles d&apos;aide pour réduire les demandes de support récurrentes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Form (Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              </span>
              Nouvel article
            </h2>
            <FaqCreateForm prefill={prefill} />
          </div>
        </div>

        {/* Existing Articles */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900">Articles existants</h2>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{articles?.length ?? 0} Articles</span>
          </div>
          <FaqList articles={articles ?? []} />
        </div>
      </div>
    </div>
  )
}
