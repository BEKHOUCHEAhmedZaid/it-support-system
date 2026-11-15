'use client'

import { useEffect, useState } from 'react'
import { updateTechnicianStatus } from '@/lib/actions/admin'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import type { Profile } from '@/lib/types'
import { getTechnicians } from '@/lib/db/users'

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const loadTechnicians = async () => {
    try {
      const data = await getTechnicians()
      // Filtrer les techniciens non désactivés
      setTechnicians(data.filter(t => t.status !== 'disabled'))
    } catch (err) {
      console.error('Erreur chargement techniciens admin:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTechnicians()
  }, [])

  const handleStatusChange = async (userId: string, status: 'approved' | 'rejected') => {
    await updateTechnicianStatus(userId, status)
    await loadTechnicians()
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Techniciens</h1>
        <p className="text-sm text-gray-500 mt-1">Approuvez ou refusez les demandes d&apos;inscription des techniciens.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center">
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm font-medium text-gray-500">Chargement des techniciens...</span>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Technicien</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {technicians.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-gray-400 font-medium">Aucun technicien enregistré.</td>
                  </tr>
                ) : (
                  technicians.map(tech => (
                    <tr key={tech.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            {tech.full_name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{tech.full_name}</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{tech.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider
                          ${tech.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                            tech.status === 'rejected' ? 'bg-red-50 text-red-600' : 
                            'bg-amber-50 text-amber-600 animate-pulse'}`}
                        >
                          {tech.status === 'approved' ? 'Approuvé' : tech.status === 'rejected' ? 'Refusé' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {tech.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(tech.id, 'approved')}
                                className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                              >
                                APPROUVER
                              </button>
                              <button
                                onClick={() => handleStatusChange(tech.id, 'rejected')}
                                className="px-4 py-2 bg-white border border-red-100 text-red-500 text-[10px] font-black rounded-xl hover:bg-red-50 transition-colors"
                              >
                                REFUSER
                              </button>
                            </>
                          )}
                          <DeleteUserButton userId={tech.id} userName={tech.full_name ?? ''} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
