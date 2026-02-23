import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Identifica o IP real através do proxy da Vercel
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '0.0.0.0';
    const body = await req.json();
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log(`[IPShield] Captura detectada: IP ${ip} vindo de ${body.domain}`);

    // Aqui entrará a conexão direta com o Supabase para salvar o log
    return NextResponse.json({ 
      success: true, 
      captured_ip: ip 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha na coleta' }, { status: 500 });
  }
}
