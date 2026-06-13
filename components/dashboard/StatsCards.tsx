import { ShieldOff, ShieldCheck, Eye, Database } from 'lucide-react'

interface Props {
  blockedToday: number
  allowedToday: number
  decoyHits: number
  totalBlocks: number
  totalIps: number
}

export default function StatsCards({ blockedToday, allowedToday, decoyHits, totalBlocks, totalIps }: Props) {
  const cards = [
    {
      label: 'Bloqueados hoje',
      value: blockedToday.toLocaleString('pt-BR'),
      icon: ShieldOff,
      iconClass: 'text-red-400 bg-red-900/30',
      valueClass: 'text-red-400',
    },
    {
      label: 'Permitidos hoje',
      value: allowedToday.toLocaleString('pt-BR'),
      icon: ShieldCheck,
      iconClass: 'text-green-400 bg-green-900/30',
      valueClass: 'text-green-400',
    },
    {
      label: 'Decoy hits hoje',
      value: decoyHits.toLocaleString('pt-BR'),
      icon: Eye,
      iconClass: 'text-amber-400 bg-amber-900/30',
      valueClass: 'text-amber-400',
    },
    {
      label: 'Total bloqueado (30d)',
      value: totalBlocks.toLocaleString('pt-BR'),
      icon: Database,
      iconClass: 'text-brand-400 bg-brand-900/30',
      valueClass: 'text-brand-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, iconClass, valueClass }) => (
        <div key={label} className="stat-card">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500">{label}</p>
            <span className={`p-1.5 rounded-lg ${iconClass}`}>
              <Icon size={14} />
            </span>
          </div>
          <p className={`text-2xl font-semibold ${valueClass}`}>{value}</p>
        </div>
      ))}
    </div>
  )
}
