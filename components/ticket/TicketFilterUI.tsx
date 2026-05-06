'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/lib/hooks/useDebounce'

export function TicketFilterUI() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    router.push(`?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  const currentStatus = searchParams.get('status') || ''

  const setStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/20">
      <div className="relative w-full md:w-80 group">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un ticket..."
          className="w-full pl-11 pr-4 py-2.5 text-xs font-bold border border-gray-100 rounded-2xl bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-primary transition-all"
        />
      </div>

      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100">
        {[
          { label: 'Tous', value: '' },
          { label: 'Ouverts', value: 'open' },
          { label: 'En cours', value: 'in_progress' },
          { label: 'Résolus', value: 'resolved' },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
              ${currentStatus === s.value 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
