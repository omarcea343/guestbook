import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const requestStart = Date.now()
  
  const response = NextResponse.next()
  
  const pathname = request.nextUrl.pathname
  const method = request.method
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown'
  
  response.headers.set('x-middleware-request-id', crypto.randomUUID())
  
  const responseTime = Date.now() - requestStart
  
  console.log(
    `[${new Date().toISOString()}] ${method} ${pathname} - ${responseTime}ms - IP: ${clientIp} - UA: ${userAgent.substring(0, 50)}...`
  )
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}