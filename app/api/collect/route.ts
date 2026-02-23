import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '0.0.0.0';
        const body = await req.json();

        // LOG para você ver no painel da Vercel
        console.log(`[CAPTURADO] IP: ${ip} | Site: ${body.domain}`);

        return NextResponse.json({ success: true, ip }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

// Necessário para permitir chamadas de outros sites (CORS)
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
