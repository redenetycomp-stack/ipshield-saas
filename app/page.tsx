"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalIps: 0, threats: 0, savings: 0 });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center">IPShield Dashboard</h1>
        <p className="text-slate-500 text-center mt-2 font-medium">Sistema de monitoramento e bloqueio em tempo real</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">IPs Monitorados</h3>
          <p className="text-5xl font-black text-slate-900 mt-2">{stats.totalIps}</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Bloqueios Google Ads</h3>
          <p className="text-5xl font-black text-red-600 mt-2">{stats.threats}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Economia Estimada</h3>
          <p className="text-5xl font-black text-emerald-600 mt-2">R$ {stats.savings.toFixed(2)}</p>
        </div>
      </main>
    </div>
  );
}
