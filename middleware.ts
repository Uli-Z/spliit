import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const password = process.env.SHARED_PASSWORD
  if (!password) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/apple-icon') ||
    pathname.startsWith('/android-chrome')
  ) {
    return NextResponse.next()
  }

  if (pathname === '/login' || pathname === '/api/login') {
    return NextResponse.next()
  }

  const cookie = request.cookies.get('spliit-auth')
  if (cookie && cookie.value === password) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: '/:path*',
}
