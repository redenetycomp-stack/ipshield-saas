"use client"; // ESSENCIAL: Define como Client Component para permitir Hooks e resolver o erro de build

import { useEffect, useState } from "react";

// Variáveis de ambiente para conexão com o Supabase (Fase 1 e 5 do Roadmap)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function DashboardPage() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lógica para procurar IPs capturados no Supabase (Fase 1: API de coleta)
    const fetchCapturedIps = async () => {
      try {
        // Futura integração: const { data } = await supabase.from('captured_ips').select('*');
        // Por enquanto, simulamos o estado de carregamento do Dashboard Profissional
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar métricas:", error);
        setLoading(false);
      }
    };

    fetchCapturedIps();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">IPShield Dashboard</h1>
        <p className="text-gray-600">Monitorização e Bloqueio Automático em Tempo Real</p>
      </header>
      
      {/* Diferencial Competitivo: Métricas de Economia e Automação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase">IPs Capturados</p>
          <p className="text-4xl font-bold text-blue-600">{ips.length}</p>
        </div>
        
        <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase">Bloqueios no Google Ads</p>
          <p className="text-4xl font-bold text-red-500">0</p>
        </div>

        <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase">Economia Estimada</p>
          <p className="text-4xl font-bold text-green-600">€ 0,00</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Logs de Captura Recentes</h2>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">A carregar dados do sistema...</td></tr>
            ) : ips.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-400">A aguardar capturas do script instalado.</td></tr>
            ) : (
              ips.map((item: any, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 font-mono text-sm">{item.ip}</td>
