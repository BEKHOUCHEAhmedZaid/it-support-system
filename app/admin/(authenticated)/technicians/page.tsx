import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateTechnicianStatus } from '@/lib/actions/admin'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'

export default async function AdminTechniciansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: technicians, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'technician')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching technicians:', error)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Techniciens</h1>
        <p className="text-sm text-gray-500 mt-1">Approuvez ou refusez les demandes d&apos;inscription des techniciens.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Technicien</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(technicians ?? []).length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-gray-400 font-medium">Aucun technicien enregistré.</td>
                </tr>
              ) : (
                technicians?.map(tech => (
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
                            <form action={async () => { 'use server'; await updateTechnicianStatus(tech.id, 'approved') }}>
                              <button className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200">
                                APPROUVER
                              </button>
                            </form>
                            <form action={async () => { 'use server'; await updateTechnicianStatus(tech.id, 'rejected') }}>
                              <button className="px-4 py-2 bg-white border border-red-100 text-red-500 text-[10px] font-black rounded-xl hover:bg-red-50 transition-colors">
                                REFUSER
                              </button>
                            </form>
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
        </div>
      </div>
    </div>
  )
}
