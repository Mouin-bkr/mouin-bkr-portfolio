import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Enforce a single canonical host (e.g., www.mouinboubakri.tech)
const CANONICAL_HOST = (process.env.NEXT_PUBLIC_SITE_URL || '')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')
  .toLowerCase()

export function middleware(req: NextRequest) {
  // Skip if not configured
  if (!CANONICAL_HOST) return NextResponse.next()

  const host = (req.headers.get('host') || '').toLowerCase()

  // Allow localhost/dev and Vercel preview domains
  if (
    host === 'localhost:3000' ||
    host.endsWith('.vercel.app') ||
    host === CANONICAL_HOST
  ) {
    return NextResponse.next()
  }

  // Redirect any other host (e.g., apex) to the canonical host
  const url = req.nextUrl.clone()
  url.host = CANONICAL_HOST
  url.protocol = 'https:'
  return NextResponse.redirect(url, 308)
}

// Avoid redirect loops and exclude static assets
export const config = {
  matcher: [
    '/((?!_next/|favicon.ico|icon.svg|manifest.webmanifest|sitemap.xml|robots.txt).*)',
  ],
}
