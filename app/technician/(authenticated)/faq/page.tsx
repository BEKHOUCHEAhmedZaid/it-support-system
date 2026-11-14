'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaqList } from '@/components/faq/FaqList'
import { FaqCreateForm } from '@/components/faq/FaqCreateForm'
import Link from 'next/link'
import type { FaqArticle } from '@/lib/types'
import { getFaqArticles } from '@/lib/db/faq'

function TechnicianFaqContent() {
  const searchParams = useSearchParams()
  const prefillParam = searchParams.get('prefill')

  const [articles, setArticles] = useState<FaqArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getFaqArticles(true)
      .then((data) => {
        if (isMounted) {
          setArticles(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Erreur chargement articles FAQ technicien:', err)
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  let prefill: { title?: string; content?: string; category?: string } = {}
  if (prefillParam) {
    try {
      prefill = JSON.parse(decodeURIComponent(prefillParam))
    } catch {}
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
            <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{articles.length} Articles</span>
          </div>
          {loading ? (
            <div className="py-20 text-center">
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm font-medium text-gray-500">Chargement des articles...</span>
              </div>
            </div>
          ) : (
            <FaqList articles={articles} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function TechnicianFaqPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <div className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm font-medium text-gray-500">Chargement...</span>
        </div>
      </div>
    }>
      <TechnicianFaqContent />
    </Suspense>
  )
}
