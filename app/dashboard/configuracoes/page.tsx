'use client'

import { useState } from 'react'
import { Copy, Check, Code2, Key } from 'lucide-react'

export default function ConfiguracoesPage() {
  const [copied, setCopied] = useState(false)

  const scriptCode = `<!-- IPShield - Proteção contra clique fraude -->
<script>
  window.IPSHIELD_SITE_ID = 'SEU_SITE_ID';
</script>
<script src="https://ipshield-saas.vercel.app/pixel.js" async></script>`

  function copyScript() {
    navigator.clipboard.writeText(scriptCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Configurações</h1>
        <p className="text-sm text-gray-500 mt-0.5">Instale o script e configure sua conta</p>
      </div>

      {/* Script installation */}
      <div className="stat-card space-y-4">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-brand-400" />
          <h2 className="text-sm font-medium text-white">Instalar script de rastreamento</h2>
        </div>
        <p className="text-xs text-gray-500">
          Cole este código antes do fechamento da tag <code className="text-brand-300">&lt;/head&gt;</code> em todas as páginas que deseja monitorar.
        </p>

        <div className="relative">
          <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
            {scriptCode}
          </pre>
          <button
            onClick={copyScript}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-100"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          </button>
        </div>

        <div className="bg-brand-950 border border-brand-800/50 rounded-lg p-3 text-xs text-brand-300">
          Substitua <code className="font-mono">SEU_SITE_ID</code> pelo ID do seu site no IPShield.
        </div>
      </div>

      {/* API endpoint info */}
      <div className="stat-card space-y-3">
        <div className="flex items-center gap-2">
          <Key size={16} className="text-amber-400" />
          <h2 className="text-sm font-medium text-white">Endpoint de coleta</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-0.5 rounded font-mono">POST</span>
          <code className="text-xs text-gray-300 font-mono">https://ipshield-saas.vercel.app/api/collect</code>
        </div>
        <p className="text-xs text-gray-500">
          O script envia automaticamente dados de cliques para este endpoint. Os IPs são analisados e as decisões ficam disponíveis no painel.
        </p>
      </div>
    </div>
  )
}
