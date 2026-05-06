'use client'
import { useState } from 'react'
import type { FaqArticle } from '@/lib/types'

export function FaqList({ articles, isAdmin }: { articles: FaqArticle[], isAdmin?: boolean }) {
  const [search, setSearch] = useState('')

  const categories = [...new Set(articles.map(a => a.category ?? 'Général'))]

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.content.toLowerCase().includes(search.toLowerCase())
  )

  const byCategory = categories.reduce<Record<string, FaqArticle[]>>((acc, cat) => {
    acc[cat] = filtered.filter(a => (a.category ?? 'Général') === cat)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative group max-w-xl mx-auto">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Comment pouvons-nous vous aider aujourd'hui ?"
          className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-6 py-4 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-blue-50 transition-all"
        />
      </div>

      {/* Articles by category */}
      <div className="space-y-10">
        {categories.map(cat => (
          byCategory[cat]?.length > 0 && (
            <div key={cat} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">{cat}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {byCategory[cat].map(article => (
                  <details key={article.id} className="group rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all overflow-hidden">
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-bold text-gray-800 select-none list-none">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </span>
                        {article.title}
                        {isAdmin && !article.is_public && (
                          <span className="ml-3 text-[8px] font-black bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-widest">Privé</span>
                        )}
                      </div>
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-400 group-open:rotate-180 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-5 animate-in slide-in-from-top-2 duration-300">
                      <div className="prose prose-sm max-w-none text-gray-600">
                        {article.content}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Aucun résultat trouvé</h3>
          <p className="text-sm text-gray-400 mt-1">Réessayez avec d&apos;autres mots clés ou contactez le support.</p>
        </div>
      )}
    </div>
  )
}
