'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DailyStat {
  date: string
  blocks: number
  allows: number
  decoy_hits: number
}

export default function ActivityChart({ data }: { data: DailyStat[] }) {
  const chartData = [...data].reverse().map(d => ({
    date: d.date,
    Bloqueados: d.blocks || 0,
    Permitidos: d.allows || 0,
    Decoy: d.decoy_hits || 0,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs space-y-1">
        <p className="text-gray-400 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-mono font-medium text-gray-100">{p.value.toLocaleString('pt-BR')}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="stat-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-100">Atividade diária</h3>
          <p className="text-xs text-gray-500 mt-0.5">Últimos 30 dias</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Bloqueados</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />Permitidos</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
          Nenhum dado ainda. Instale o script para começar.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBloqueados" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPermitidos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b52ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b52ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Bloqueados" stroke="#ef4444" strokeWidth={2} fill="url(#colorBloqueados)" />
            <Area type="monotone" dataKey="Permitidos" stroke="#3b52ff" strokeWidth={2} fill="url(#colorPermitidos)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
