'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Shield, Globe, BarChart3, Bell,
  Settings, LogOut, ChevronDown
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',         icon: LayoutDashboard, label: 'Painel' },
  { href: '/dashboard/ips',     icon: Shield,          label: 'IPs Bloqueados' },
  { href: '/dashboard/sites',   icon: Globe,           label: 'Sites' },
  { href: '/dashboard/relatorios', icon: BarChart3,    label: 'Relatórios' },
  { href: '/dashboard/alertas', icon: Bell,            label: 'Alertas' },
  { href: '/dashboard/configuracoes', icon: Settings,  label: 'Configurações' },
]

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col bg-gray-900 border-r border-gray-800 h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <span className="font-semibold text-white text-sm">IPShield</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${active ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 mb-1">
          <div className="w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-brand-200">
              {userEmail[0]?.toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-gray-400 truncate flex-1">{userEmail}</span>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-1"
        >
          <LogOut size={15} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
