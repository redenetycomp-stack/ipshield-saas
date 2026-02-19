import { useEffect, useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function supabase(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  return res.json();
}

interface BlockedIP {
  ip: string;
  user_agent: string;
  referrer: string;
  last_seen: string;
  total_clicks: number;
  decoy_views: number;
}

interface DailyStat {
  date: string;
  blocks: number;
  allows: number;
  decoy_hits: number;
  block_rate_pct: number;
}

export default function IPShieldDashboard() {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const loadData = async () => {
    const [ips, dailyStats] = await Promise.all([
      supabase("dashboard_blocked_ips?limit=50"),
      supabase("dashboard_daily_stats?limit=7"),
    ]);
    setBlockedIPs(ips || []);
    setStats(dailyStats || []);
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Auto-refresh a cada 30s
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, []);

  const today = stats[0];
  const todayBlocks = today?.blocks ?? 0;
  const todayAllows = today?.allows ?? 0;
  const blockRate = today?.block_rate_pct ?? 0;
  const decoyHits = today?.decoy_hits ?? 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🛡️ IPShield Dashboard</h1>
          <p style={styles.subtitle}>
            Atualizado às {lastUpdate.toLocaleTimeString("pt-BR")}
            {" · "}
            <span style={styles.live}>● LIVE</span>
          </p>
        </div>
        <button onClick={loadData} style={styles.refreshBtn}>
          ↻ Atualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <KPICard label="Bloqueados hoje" value={todayBlocks.toString()} color="#ff2d2d" icon="🚫" />
        <KPICard label="Permitidos hoje" value={todayAllows.toString()} color="#00e5a0" icon="✅" />
        <KPICard label="Taxa de bloqueio" value={`${blockRate}%`} color="#fbbf24" icon="📊" />
        <KPICard label="Visitas à isca" value={decoyHits.toString()} color="#a78bfa" icon="🪤" />
      </div>

      {/* Blocked IPs Table */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>IPs Bloqueados</h2>
          <span style={styles.badge}>{blockedIPs.length} IPs</span>
        </div>

        {loading ? (
          <div style={styles.loading}>Carregando dados...</div>
        ) : blockedIPs.length === 0 ? (
          <div style={styles.empty}>Nenhum IP bloqueado ainda.</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["IP", "Cliques", "Visitou Isca", "User-Agent", "Último acesso"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blockedIPs.map((row, i) => (
                  <tr key={row.ip} style={{ background: i % 2 === 0 ? "#0f0f0f" : "#111" }}>
                    <td style={{ ...styles.td, fontFamily: "monospace", color: "#ff2d2d" }}>
                      {row.ip}
                    </td>
                    <td style={styles.tdCenter}>{row.total_clicks}</td>
                    <td style={styles.tdCenter}>
                      {row.decoy_views > 0 ? (
                        <span style={{ color: "#a78bfa" }}>🪤 {row.decoy_views}x</span>
                      ) : "—"}
                    </td>
                    <td style={{ ...styles.td, color: "#666", fontSize: "12px", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {row.user_agent || "—"}
                    </td>
                    <td style={{ ...styles.td, color: "#666", fontSize: "12px" }}>
                      {row.last_seen ? new Date(row.last_seen).toLocaleString("pt-BR") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 7-day chart */}
      {stats.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Últimos 7 dias</h2>
          </div>
          <div style={styles.barChart}>
            {[...stats].reverse().map((s) => {
              const max = Math.max(...stats.map((x) => x.blocks), 1);
              const height = Math.max((s.blocks / max) * 120, 4);
              return (
                <div key={s.date} style={styles.barGroup}>
                  <span style={styles.barValue}>{s.blocks}</span>
                  <div style={{ ...styles.bar, height: `${height}px` }} title={`${s.blocks} bloqueios`} />
                  <span style={styles.barLabel}>
                    {new Date(s.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <div style={{ ...styles.kpiCard, borderTopColor: color }}>
      <div style={styles.kpiIcon}>{icon}</div>
      <div style={{ ...styles.kpiValue, color }}>{value}</div>
      <div style={styles.kpiLabel}>{label}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { background: "#0a0a0a", minHeight: "100vh", padding: "32px", fontFamily: "system-ui, sans-serif", color: "#e8e8e8" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" },
  title: { fontSize: "24px", fontWeight: 800, margin: 0 },
  subtitle: { fontSize: "13px", color: "#666", marginTop: "6px" },
  live: { color: "#ff2d2d", fontWeight: 700 },
  refreshBtn: { background: "#1a1a1a", border: "1px solid #333", color: "#aaa", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" },
  kpiCard: { background: "#111", border: "1px solid #1f1f1f", borderTop: "2px solid", padding: "20px", borderRadius: "4px" },
  kpiIcon: { fontSize: "24px", marginBottom: "8px" },
  kpiValue: { fontSize: "32px", fontWeight: 800, lineHeight: 1 },
  kpiLabel: { fontSize: "12px", color: "#666", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.1em" },
  card: { background: "#111", border: "1px solid #1f1f1f", borderRadius: "4px", marginBottom: "24px", overflow: "hidden" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1f1f1f" },
  cardTitle: { fontSize: "14px", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" },
  badge: { background: "#ff2d2d22", color: "#ff2d2d", fontSize: "12px", padding: "2px 8px", borderRadius: "20px" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: { padding: "10px 16px", textAlign: "left", color: "#555", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid #1f1f1f" },
  td: { padding: "10px 16px", borderBottom: "1px solid #161616" },
  tdCenter: { padding: "10px 16px", textAlign: "center", borderBottom: "1px solid #161616" },
  loading: { padding: "40px", textAlign: "center", color: "#555" },
  empty: { padding: "40px", textAlign: "center", color: "#555" },
  barChart: { display: "flex", alignItems: "flex-end", gap: "12px", padding: "24px 20px 16px", height: "180px" },
  barGroup: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 },
  barValue: { fontSize: "11px", color: "#666" },
  bar: { width: "100%", background: "#ff2d2d", borderRadius: "2px 2px 0 0", minHeight: "4px", transition: "height 0.3s" },
  barLabel: { fontSize: "11px", color: "#555", marginTop: "4px" },
};
