import type { SystemInfo } from '@/lib/types'

export function SystemInfoDisplay({ info }: { info: SystemInfo }) {
  if (!info || Object.keys(info).length === 0) return null

  const rows: [string, string][] = [
    ['OS',             info.platform],
    ['User Agent',     info.userAgent],
    ['Résolution',     `${info.screenWidth} × ${info.screenHeight}`],
    ['RAM Dispo.',     info.deviceMemory != null ? `${info.deviceMemory} GB` : '—'],
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg text-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
        </span>
        <h3 className="text-base font-bold text-gray-900">Informations système</h3>
      </div>
      
      <div className="space-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <dt className="text-[13px] font-semibold text-gray-700">{k}</dt>
            <dd className="text-[11px] font-mono text-gray-500 bg-gray-50 rounded-md px-3 py-1.5 max-w-[180px] truncate">
              {v}
            </dd>
          </div>
        ))}
      </div>

      {info.recentErrors && info.recentErrors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-50">
          <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-2">Erreurs console</p>
          <ul className="space-y-1.5">
            {info.recentErrors.slice(0, 3).map((e, i) => (
              <li key={i} className="text-[10px] font-mono text-red-700 bg-red-50 rounded-lg px-3 py-2 leading-relaxed">
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
