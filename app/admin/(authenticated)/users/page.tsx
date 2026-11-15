'use client'

import { useEffect, useState } from 'react'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import type { Profile } from '@/lib/types'
import { getAllClients } from '@/lib/db/users'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getAllClients()
      .then((data) => {
        if (isMounted) {
          // Filtrer les utilisateurs non désactivés
          setUsers(data.filter(u => u.status !== 'disabled'))
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Erreur chargement clients admin:', err)
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Base Utilisateurs</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez les comptes clients de la plateforme.</p>
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
                <span className="text-sm font-medium text-gray-500">Chargement des utilisateurs...</span>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Système</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-medium">Aucun client enregistré.</td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {u.full_name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[10px] font-mono text-gray-400">
                        {u.id}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <DeleteUserButton userId={u.id} userName={u.full_name ?? ''} />
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
