import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IPShield — Proteção contra cliques fraudulentos',
  description: 'Detecte e bloqueie tráfego fraudulento em suas campanhas do Google Ads em tempo real.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  )
}
