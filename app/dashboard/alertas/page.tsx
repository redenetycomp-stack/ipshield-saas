import { createClient } from '@/lib/supabase/server'
import { Bell } from 'lucide-react'

export const revalidate = 30

export default async function AlertasPage() {
  const supabase = createClient()
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Alertas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Histórico de notificações do sistema</p>
      </div>

      <div className="stat-card">
        {!alerts || alerts.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={36} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Nenhum alerta registrado.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800/50">
            {alerts.map((a: any) => (
              <li key={a.id} className="py-3 flex items-start gap-3">
                <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  a.type === 'error' || a.type === 'high' ? 'bg-red-500' :
                  a.type === 'success' ? 'bg-green-500' : 'bg-brand-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">{a.message || '—'}</p>
                  {a.created_at && (
                    <p className="text-xs text-gray-600 mt-0.5">
                      {new Date(a.created_at).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
