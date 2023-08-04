import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value || ''
  const publicPaths = ['/login', '/signup']
  const privatePaths = ['/todos', '/profile', '/api/todos/delete/:id']

  const isPublicPath = publicPaths.includes(path)
  const isPrivatePath = privatePaths.includes(path)

  if (isPrivatePath && !token) {
    NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  if (isPublicPath && token) {
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
    '/profile',
    '/api/todos/delete/:id*',
  ],
}
