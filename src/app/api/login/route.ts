import { env } from '@/lib/env'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (!env.SHARED_PASSWORD) {
    return NextResponse.json({ success: true })
  }

  const { password } = (await request.json()) as { password?: string }
  if (password === env.SHARED_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('spliit-auth', password, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return response
  }
  return NextResponse.json({ success: false }, { status: 401 })
}
