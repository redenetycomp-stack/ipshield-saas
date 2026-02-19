'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function BlockedContent() {
  const searchParams = useSearchParams();
  const [ip, setIp] = useState('IP não disponível');
  const [count, setCount] = useState(1247 + Math.floor(Math.random() * 50));
  const [time, setTime] = useState('');

  useEffect(() => {
    // 1. Define o IP vindo do Middleware
    const ipParam = searchParams.get('ip');
    if (ipParam) setIp(ipParam);

    // 2. Define a hora atual
    setTime(new Date().toLocaleTimeString('pt-BR'));

    // 3. Registrar visita à isca no backend (API track-decoy)
    const trackVisit = async () => {
      try {
        await fetch('/api/track-decoy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ip: ipParam || '0.0.0.0',
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            capturedAt: new Date().toISOString(),
            url: window.location.href,
          }),
        });
      } catch (err) {
        console.error('Erro ao rastrear:', err);
      }
    };

    trackVisit();

    // 4. Simulador de contador live
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setCount(prev => prev + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [searchParams]);

  return (
    <div className="container">
      <style jsx global>{`
        :root {
          --red: #ff2d2d;
          --red-dim: rgba(255,45,45,0.12);
          --dark: #0a0a0a;
          --surface: #111111;
          --border: rgba(255,255,255,0.06);
          --text: #e8e8e8;
          --muted: #666;
          --green: #00e5a0;
        }
        body {
          background: var(--dark);
          color: var(--text);
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0;
        }
        .alert-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: var(--red); color: #fff; padding: 10px;
          text-align: center; font-family: monospace; font-size: 11px;
        }
        .card {
          background: var(--surface); border: 1px solid var(--border);
          border-top: 2px solid var(--red); padding: 50px;
          max-width: 680px; width: 90%; position: relative;
        }
        .ip-box {
          background: var(--red-dim); border: 1px solid rgba(255,45,45,0.3);
          padding: 15px; margin: 20px 0; font-family: monospace;
        }
        .cta {
          display: block; background: var(--red); color: #fff;
          padding: 16px; text-align: center; font-weight: bold;
          text-decoration: none; margin-top: 20px;
        }
        .features { list-style: none; padding: 0; margin: 20px 0; color: #aaa; font-size: 14px; }
        .features li { margin-bottom: 8px; }
        .features li::before { content: "→ "; color: var(--green); }
      `}</style>

      <div className="alert-bar">⚠ IPSHIELD ACTIVE — CLICK FRAUD PROTECTION ENABLED</div>

      <div className="card">
        <span style={{ fontSize: '48px' }}>🛡️</span>
        <h1 style={{ fontWeight: 800 }}>Seu IP foi <em style={{ color: 'var(--red)', fontStyle: 'normal' }}>filtrado</em> pelo IPShield.</h1>

        <div className="ip-box">
          <div style={{ color: 'var(--red)', fontSize: '10px' }}>IP DETECTADO</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{ip}</div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
          {count.toLocaleString('pt-BR')} IPs bloqueados hoje · Sessão registrada às {time}
        </p>

        <p style={{ marginTop: '20px' }}>
          Percebemos que você estava interessado em como protegemos os anúncios dos nossos clientes.
          <strong> Você acabou de experimentar o IPShield em primeira mão.</strong>
        </p>

        <div style={{ height: '1px', background: 'var(--border)', margin: '30px 0' }} />

        <div className="pivot-label" style={{ color: 'var(--green)', fontSize: '10px' }}>✦ UMA IDEIA MELHOR</div>
        <h2 style={{ fontSize: '20px' }}>E se você usasse essa tecnologia a seu favor?</h2>

        <ul className="features">
          <li>Detecção de fraude via IA (Gemini Flash) em tempo real</li>
          <li>Dashboard com IPs capturados e origem</li>
          <li>Página isca customizável como esta</li>
        </ul>

        <a className="cta" href="https://ipshield.app/demo">
          QUERO PROTEGER MEUS ANÚNCIOS →
        </a>
      </div>
    </div>
  );
}

export default function BlockedPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BlockedContent />
    </Suspense>
  );
}
