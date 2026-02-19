import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ip, userAgent, referrer, capturedAt, url } = body;

    // Registrar visita à página isca
    await fetch(`${SUPABASE_URL}/rest/v1/decoy_visits`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ip,
        user_agent: userAgent,
        referrer,
        captured_at: capturedAt,
        source_url: url,
        converted: false, // se clicar no CTA, atualizar para true
      }),
    });

    // Atualizar estatística de total de bloqueios
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_block_count`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_date: new Date().toISOString().split('T')[0] }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
