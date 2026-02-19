import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/lp/:path*', '/landing/:path*', '/ads/:path*'],
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!; // Note o NEXT_PUBLIC_ se necessário
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const DECOY_PAGE = '/blocked'; // página isca

async function checkSupabase(ip: string): Promise<'whitelist' | 'blacklist' | 'unknown'> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ip_decisions?ip=eq.${encodeURIComponent(ip)}&select=decision&limit=1`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      // Cache agressivo - decisões duram 1h no edge
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return 'unknown';
  const data = await res.json();
  if (!data.length) return 'unknown';
  return data[0].decision as 'whitelist' | 'blacklist';
}

async function analyzeWithGemini(
  ip: string,
  userAgent: string,
  gclid: string | null,
  referrer: string | null
): Promise<'block' | 'allow'> {
  const prompt = `You are an ad fraud detection engine. Analyze this click and decide if it's a competitor or click fraud.

IP: ${ip}
User-Agent: ${userAgent}
Google Click ID (gclid): ${gclid || 'none'}
Referrer: ${referrer || 'direct'}

Rules for BLOCK decision:
- Bot-like or headless browser user agents (HeadlessChrome, PhantomJS, Selenium, curl, python-requests, etc.)
- No gclid but hitting a landing page directly (suspicious direct traffic)
- Known VPN/datacenter IP patterns in user agent strings
- Unusual referrer patterns suggesting competitor monitoring tools

Rules for ALLOW decision:
- Normal browser user agents with valid gclid
- Mobile traffic with gclid (hard to fake)
- Standard desktop browsers from organic paths

Respond with ONLY one word: BLOCK or ALLOW`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 10,
          topP: 1,
        },
      }),
    }
  );

  if (!res.ok) return 'allow'; // fail-open: na dúvida, não bloqueia

  const data = await res.json();
  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();
  return answer === 'BLOCK' ? 'block' : 'allow';
}

async function saveDecision(
  ip: string,
  decision: 'whitelist' | 'blacklist',
  metadata: Record<string, unknown>
) {
  await fetch(`${SUPABASE_URL}/rest/v1/ip_decisions`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      ip,
      decision,
      metadata,
      last_seen: new Date().toISOString(),
    }),
  });
}

async function logCapturedClick(ip: string, url: string, userAgent: string, gclid: string | null) {
  await fetch(`${SUPABASE_URL}/rest/v1/captured_clicks`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ip,
      url,
      user_agent: userAgent,
      gclid,
      captured_at: new Date().toISOString(),
    }),
  });
}

export default async function middleware(req: NextRequest) {
  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '0.0.0.0';

  const userAgent = req.headers.get('user-agent') || '';
  const gclid = req.nextUrl.searchParams.get('gclid');
  const referrer = req.headers.get('referer');

  // 1. Checar cache local Supabase primeiro (zero custo de API)
  const knownStatus = await checkSupabase(ip);

  if (knownStatus === 'blacklist') {
    // Já sabemos que é ruim — redirecionar imediatamente
    await logCapturedClick(ip, req.url, userAgent, gclid);

    const decoyUrl = new URL(DECOY_PAGE, req.url);
    decoyUrl.searchParams.set('ip', ip);
    // Redirect 302 — parece navegação normal
    return NextResponse.redirect(decoyUrl, { status: 302 });
  }

  if (knownStatus === 'whitelist') {
    // IP bom, deixa passar sem gastar nada
    return NextResponse.next();
  }

  // 2. IP novo — consultar Gemini para decisão
  const geminiDecision = await analyzeWithGemini(ip, userAgent, gclid, referrer);

  // 3. Salvar decisão no Supabase (async, não bloqueia a resposta)
  const supabaseDecision = geminiDecision === 'block' ? 'blacklist' : 'whitelist';
  const metadata = { userAgent, gclid, referrer, analyzedAt: new Date().toISOString() };

  // Fire & forget — não await aqui para não adicionar latência
  saveDecision(ip, supabaseDecision, metadata);

  if (geminiDecision === 'block') {
    logCapturedClick(ip, req.url, userAgent, gclid);

    const decoyUrl = new URL(DECOY_PAGE, req.url);
    decoyUrl.searchParams.set('ip', ip);
    return NextResponse.redirect(decoyUrl, { status: 302 });
  }

  return NextResponse.next();
}
