import { createClient } from '@/lib/supabase/server'
import { FaqList } from '@/components/faq/FaqList'
import { FaqCreateForm } from '@/components/faq/FaqCreateForm'
import Link from 'next/link'

export default async function AdminFaqPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('faq_articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            <Link href="/admin/tickets" className="hover:text-primary">Espace Admin</Link>
            <span>&gt;</span>
            <span className="text-gray-900">Gestion FAQ</span>
          </nav>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Base de connaissances</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les articles d&apos;aide pour vos utilisateurs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <FaqCreateForm />
        </div>
        <div className="lg:col-span-8">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Articles existants</h2>
          <FaqList articles={articles ?? []} isAdmin />
        </div>
      </div>
    </div>
  )
}
