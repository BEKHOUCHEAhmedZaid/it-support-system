import { createClient } from '@/lib/supabase/server'
import { FaqList } from '@/components/faq/FaqList'
import Link from 'next/link'

export default async function ClientFaqPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('faq_articles')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            <Link href="/client/tickets" className="hover:text-primary">Espace Client</Link>
            <span>&gt;</span>
            <span className="text-gray-900">Base de connaissances</span>
          </nav>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Besoin d&apos;aide ?</h1>
          <p className="text-sm text-gray-500 mt-1">Trouvez rapidement des réponses aux questions les plus fréquentes.</p>
        </div>
      </div>

      <FaqList articles={articles ?? []} />
    </div>
  )
}
