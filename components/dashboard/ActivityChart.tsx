'use client'
cd ~/Downloads/ipshield-saas
cat > components/dashboard/ActivityChart.tsx << 'EOF'
'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
  }))

  return (
    <div className="stat-card h-full">
      <h3 className="text-sm font-medium text-gray-100 mb-4">Atividade diária</h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
          Nenhum dado ainda.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
            <Tooltip />
            <Area type="monotone" dataKey="Bloqueados" stroke="#ef4444" fill="#ef444430" />
            <Area type="monotone" dataKey="Permitidos" stroke="#3b52ff" fill="#3b52ff30" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
