import { NextResponse } from 'next/server'
import { getUserIdFromToken } from './getUserIdFromToken'

export function middleware(request) {
  const path = request.nextUrl.pathname
  const publicPaths = ['/login', '/signup', '/forgotpassword', '/resetpassword']

  let token = request.cookies.get('token')?.value || ''
  let resetToken = false

  // Make sure the token is valid before proceeding
  if (token) {
    try {
      getUserIdFromToken(token)
    } catch (error) {
      // in case token is invalid, reset it
      token = ''
      resetToken = true
    }
  }

  const isPublicPath = publicPaths.includes(path)

  if ((path === '/' || isPublicPath) && token) {
    return NextResponse.redirect(new URL('/todos', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    const response = NextResponse.redirect(new URL('/login', request.nextUrl))

    if (resetToken) {
      response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0),
      })
    }
    return response
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/todos',
    '/forgotpassword',
    '/resetpassword',
    '/profile',
    '/verifyemail',
    '/api/todos/:path*',
    '/api/account/:path*',
  ],
}
