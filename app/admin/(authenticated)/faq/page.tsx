'use client'

import { useEffect, useState } from 'react'
import { FaqList } from '@/components/faq/FaqList'
import { FaqCreateForm } from '@/components/faq/FaqCreateForm'
import Link from 'next/link'
import type { FaqArticle } from '@/lib/types'
import { getFaqArticles } from '@/lib/db/faq'

export default function AdminFaqPage() {
  const [articles, setArticles] = useState<FaqArticle[]>([])
  const [loading, setLoading] = useState(true)

  const loadFaq = async () => {
    try {
      const data = await getFaqArticles(false)
      setArticles(data)
    } catch (err) {
      console.error('Erreur chargement FAQ admin:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFaq()
  }, [])

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
          {loading ? (
            <div className="py-20 text-center">
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm font-medium text-gray-500">Chargement de la FAQ...</span>
              </div>
            </div>
          ) : (
            <FaqList articles={articles} isAdmin />
          )}
        </div>
      </div>
    </div>
  )
}
