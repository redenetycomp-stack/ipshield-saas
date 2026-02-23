import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Por enquanto, apenas deixa o tráfego passar livremente
  // No futuro, aqui validaremos o login do cliente para o Dashboard
  return NextResponse.next()
}

// Define quais caminhos o middleware deve observar
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
