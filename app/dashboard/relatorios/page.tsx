import { Construction } from 'lucide-react'

export default function RelatoriosPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-white">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-0.5">Análises detalhadas de fraude</p>
      </div>
      <div className="stat-card mt-6 flex flex-col items-center justify-center py-20 text-center">
        <Construction size={36} className="text-gray-700 mb-3" />
        <p className="text-gray-500 text-sm">Em breve</p>
        <p className="text-gray-600 text-xs mt-1">Esta seção está sendo desenvolvida.</p>
      </div>
    </div>
  )
}
