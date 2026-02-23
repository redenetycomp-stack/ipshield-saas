"use client"; // ESSENCIAL: Resolve o erro de build que você recebeu

import { useEffect, useState } from "react";

// Estas variáveis devem estar configuradas no painel da Vercel (Settings > Environment Variables)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function DashboardPage() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar os IPs capturados na Fase 1
    const fetchIps = async () => {
      try {
        // Exemplo de chamada para o Supabase ou sua própria API
        // const response = await fetch('/api/track-decoy'); 
        // const data = await response.json();
        // setIps(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setLoading(false);
      }
    };

    fetchIps();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">IPShield - Painel de Controle</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
          <p className="text-gray-500">IPs Capturados</p>
          <p className="text-3xl font-bold">{ips.length}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
          <p className="text-gray-500">Ameaças Detectadas</p>
          <p className="text-3xl font-bold text-red-600">0</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
          <p className="text-gray-500">Economia Estimada</p>
          <p className="text-3xl font-bold text-green-600">R$ 0,00</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center">Carregando dados...</td></tr>
            ) : ips.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center">Nenhum IP capturado ainda.</td></tr>
            ) : (
              ips.map((item: any, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">{item.ip}</td>
                  <td className="px-6 py-4">{item.created_at}</td>
                  <td className="px-6 py-4">Monitorado</td>
                </tr>
              ))
            )}
