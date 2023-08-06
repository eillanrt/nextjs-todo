import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value || ''
  const publicPaths = ['/login', '/signup', '/forgotpassword']

  const isPublicPath = publicPaths.includes(path)

  if ((path === '/' || isPublicPath) && token) {
    return NextResponse.redirect(new URL('/todos', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/todos',
    '/forgotpassword',
    '/profile',
    '/verifyemail',
    '/api/todos/:path*',
    '/api/account/:path*',
  ],
}
