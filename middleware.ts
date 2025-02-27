import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: ['/'],
}

async function refreshAccessToken(refreshToken: string, request: NextRequest) {
  try {
    const response = await fetch(new URL('/api/auth/refresh', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to refresh token')
    }
    return await response.json()
  } catch (error) {
    console.error('Token refresh failed:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (accessToken) {
    return NextResponse.next()
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  let newTokens = null
  try {
    newTokens = await refreshAccessToken(refreshToken, request)
  } catch (error) {
    console.error('Refresh token error:', error)
  }

  if (!newTokens?.accessToken) {
    const response = NextResponse.redirect(new URL('/auth', request.url));
    
    (['accessToken', 'refreshToken'] as string[]).forEach(cookie => {
      response.cookies.delete(cookie)
    })

    return response
  }

  const response = NextResponse.next()

  response.cookies.set({
    name: 'accessToken',
    value: newTokens.accessToken,
    httpOnly: true,
    sameSite: 'lax'
  })

  if (newTokens.refreshToken) {
    response.cookies.set({
      name: 'refreshToken',
      value: newTokens.refreshToken,
      httpOnly: true,
      sameSite: 'lax'
    })
  }

  return response
}