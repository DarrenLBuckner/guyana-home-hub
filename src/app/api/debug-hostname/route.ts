import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    'nextUrl.hostname': request.nextUrl.hostname,
    'nextUrl.host': request.nextUrl.host,
    'nextUrl.origin': request.nextUrl.origin,
    'request.url': request.url,
    'host_header': request.headers.get('host'),
    'x-forwarded-host': request.headers.get('x-forwarded-host'),
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'x-vercel-id': request.headers.get('x-vercel-id'),
    'x-vercel-deployment-url': request.headers.get('x-vercel-deployment-url'),
    'x-vercel-forwarded-for': request.headers.get('x-vercel-forwarded-for'),
    all_headers: Object.fromEntries(request.headers.entries()),
  })
}
