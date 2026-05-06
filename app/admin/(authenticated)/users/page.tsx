import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .or('role.eq.client,role.eq.employee')
    .order('full_name', { ascending: true })

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Base Utilisateurs</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez les comptes clients et employés de la plateforme.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 overflow-hidden">
        <div className="overflow-x-auto">
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
              {(users ?? []).map(u => (
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
                      {u.role === 'employee' ? 'Client (Legacy)' : u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[10px] font-mono text-gray-400">
                    {u.id}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <DeleteUserButton userId={u.id} userName={u.full_name ?? ''} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
