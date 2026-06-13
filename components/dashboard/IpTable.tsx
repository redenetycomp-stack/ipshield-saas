'use client'

import { useState } from 'react'
import { Search, ShieldOff, ShieldCheck, Eye } from 'lucide-react'

interface IpDecision {
  id: string
  ip: string
  decision?: string
  created_at?: string
  reason?: string
  country?: string
  clicks?: number
}

const DECISION_LABELS: Record<string, { label: string; class: string }> = {
  block:  { label: 'Bloqueado', class: 'bg-red-900/40 text-red-400 border border-red-800/50' },
  allow:  { label: 'Permitido', class: 'bg-green-900/40 text-green-400 border border-green-800/50' },
  decoy:  { label: 'Decoy', class: 'bg-amber-900/40 text-amber-400 border border-amber-800/50' },
  review: { label: 'Revisão', class: 'bg-blue-900/40 text-blue-400 border border-blue-800/50' },
}

export default function IpTable({ decisions }: { decisions: IpDecision[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = decisions.filter(d => {
    const matchSearch = !search || d.ip?.includes(search)
    const matchFilter = filter === 'all' || d.decision === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-medium text-gray-100">Decisões de IP</h3>
          <p className="text-xs text-gray-500 mt-0.5">{decisions.length} registros</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter buttons */}
          <div className="flex bg-gray-800 rounded-lg p-0.5 text-xs">
            {['all', 'block', 'allow', 'decoy'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filter === f ? 'bg-gray-700 text-gray-100' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'block' ? 'Bloqueados' : f === 'allow' ? 'Permitidos' : 'Decoy'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar IP..."
              className="input-field pl-7 py-1.5 text-xs w-36"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <ShieldCheck size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {decisions.length === 0 ? 'Nenhuma decisão registrada ainda.' : 'Nenhum resultado para o filtro.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-500 font-medium pb-2 pr-4">Endereço IP</th>
                <th className="text-left text-gray-500 font-medium pb-2 pr-4">Decisão</th>
                <th className="text-left text-gray-500 font-medium pb-2 pr-4">Motivo</th>
                <th className="text-left text-gray-500 font-medium pb-2 pr-4">País</th>
                <th className="text-left text-gray-500 font-medium pb-2">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map(row => {
                const badge = DECISION_LABELS[row.decision ?? ''] ?? { label: row.decision ?? '—', class: 'bg-gray-800 text-gray-400' }
                return (
                  <tr key={row.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-2.5 pr-4">
                      <span className="ip-badge bg-gray-800 text-gray-300">{row.ip || '—'}</span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`ip-badge ${badge.class}`}>{badge.label}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500 max-w-[200px] truncate">{row.reason || '—'}</td>
                    <td className="py-2.5 pr-4 text-gray-500">{row.country || '—'}</td>
                    <td className="py-2.5 text-gray-600">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
