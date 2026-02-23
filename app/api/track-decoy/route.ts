import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';

    // Registro da tentativa de captura conforme o Fluxo Operacional
    console.log(`IP Capturado: ${ip}`, data);

    // Na Fase 2, adicionaremos as regras de validação antifraude aqui
    // Na Fase 1, apenas confirmamos o recebimento para o banco Supabase
    
    return NextResponse.json({ 
      success: true, 
      message: "IP capturado com sucesso",
      ip: ip 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Falha na coleta" }, { status: 500 });
  }
}
