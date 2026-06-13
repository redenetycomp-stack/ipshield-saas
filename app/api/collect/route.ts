import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service key for server-side writes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
              || request.headers.get('x-real-ip')
              || 'unknown'

    const { site_id, gclid, page, user_agent, referrer } = body

    // Save raw click
    await supabase.from('captured_clicks').insert({
      ip,
      site_id: site_id || null,
      gclid: gclid || null,
      page: page || null,
      user_agent: user_agent || request.headers.get('user-agent'),
      referrer: referrer || request.headers.get('referer'),
    })

    // Check if IP is already flagged
    const { data: existing } = await supabase
      .from('ip_decisions')
      .select('decision')
      .eq('ip', ip)
      .single()

    return NextResponse.json({
      ok: true,
      decision: existing?.decision ?? 'pending',
    })
  } catch (err) {
    console.error('collect error', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET() {
  // 1x1 transparent pixel
  const pixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  )
  return new NextResponse(pixel, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache',
    },
  })
}
