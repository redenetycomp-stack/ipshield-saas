import { createClient } from '@/lib/supabase/server'
import StatsCards from '@/components/dashboard/StatsCards'
import IpTable from '@/components/dashboard/IpTable'
import ActivityChart from '@/components/dashboard/ActivityChart'
import AlertsList from '@/components/dashboard/AlertsList'

export const revalidate = 30

export default async function DashboardPage() {
  const supabase = createClient()

  const [
    { data: dailyStats },
    { data: ipDecisions },
    { data: alerts },
    { data: capturedClicks },
  ] = await Promise.all([
    supabase.from('daily_stats').select('*').order('date', { ascending: false }).limit(30),
    supabase.from('ip_decisions').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('captured_clicks').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const today = dailyStats?.[0]
  const totalBlocks = dailyStats?.reduce((sum, d) => sum + (d.blocks || 0), 0) ?? 0
  const totalAllows = dailyStats?.reduce((sum, d) => sum + (d.allows || 0), 0) ?? 0
  const totalDecoy  = dailyStats?.reduce((sum, d) => sum + (d.decoy_hits || 0), 0) ?? 0

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Painel de controle</h1>
        <p className="text-sm text-gray-500 mt-0.5">Monitoramento em tempo real de cliques e IPs suspeitos</p>
      </div>

      {/* Stats */}
      <StatsCards
        blockedToday={today?.blocks ?? 0}
        allowedToday={today?.allows ?? 0}
        decoyHits={today?.decoy_hits ?? 0}
        totalBlocks={totalBlocks}
        totalIps={ipDecisions?.length ?? 0}
      />

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActivityChart data={dailyStats ?? []} />
        </div>
        <div>
          <AlertsList alerts={alerts ?? []} />
        </div>
      </div>

      {/* IP Table */}
      <IpTable decisions={ipDecisions ?? []} />
    </div>
  )
}
