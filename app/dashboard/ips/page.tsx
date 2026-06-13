import { createClient } from '@/lib/supabase/server'
import { Shield } from 'lucide-react'

export const revalidate = 30

export default async function IpsPage() {
  const supabase = createClient()
  const { data: ips } = await supabase
    .from('ips_para_bloqueio')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">IPs para Bloqueio</h1>
        <p className="text-sm text-gray-500 mt-0.5">Lista de IPs identificados para exclusão no Google Ads</p>
      </div>

      <div className="stat-card">
        {!ips || ips.length === 0 ? (
          <div className="text-center py-16">
            <Shield size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Nenhum IP para bloqueio ainda.</p>
            <p className="text-gray-600 text-xs mt-1">Instale o script no seu site para começar a detectar IPs suspeitos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-500 font-medium pb-2 pr-4">IP</th>
                  <th className="text-left text-gray-500 font-medium pb-2 pr-4">Motivo</th>
                  <th className="text-left text-gray-500 font-medium pb-2 pr-4">Cliques</th>
                  <th className="text-left text-gray-500 font-medium pb-2">Adicionado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {ips.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-2.5 pr-4">
                      <span className="ip-badge bg-red-900/30 text-red-400 border border-red-800/40">{row.ip}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500">{row.reason || '—'}</td>
                    <td className="py-2.5 pr-4 text-gray-400 font-mono">{row.clicks ?? '—'}</td>
                    <td className="py-2.5 text-gray-600">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
