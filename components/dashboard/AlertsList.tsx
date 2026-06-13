import { AlertTriangle, Info, CheckCircle } from 'lucide-react'

interface Alert {
  id: string
  message?: string
  type?: string
  created_at?: string
}

export default function AlertsList({ alerts }: { alerts: Alert[] }) {
  function getIcon(type?: string) {
    if (type === 'error' || type === 'high') return <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
    if (type === 'success') return <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
    return <Info size={13} className="text-brand-400 flex-shrink-0 mt-0.5" />
  }

  return (
    <div className="stat-card h-full">
      <h3 className="text-sm font-medium text-gray-100 mb-4">Alertas recentes</h3>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <CheckCircle size={28} className="text-green-500 mb-2" />
          <p className="text-sm text-gray-500">Nenhum alerta</p>
          <p className="text-xs text-gray-600 mt-1">Tudo funcionando normalmente</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map(alert => (
            <li key={alert.id} className="flex gap-2">
              {getIcon(alert.type)}
              <div className="min-w-0">
                <p className="text-xs text-gray-300 leading-relaxed">{alert.message || 'Alerta sem descrição'}</p>
                {alert.created_at && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {new Date(alert.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
