import axios from 'axios'
import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: ['/'], 
}


function isAccessTokenExpired(accessToken: string): boolean {
  try {
    const payloadEncoded = accessToken.split('.')[1]
    const payload = JSON.parse(
      Buffer.from(payloadEncoded, 'base64').toString('utf8')
    )
    const exp = payload.exp
    if (!exp) return true

    return Date.now() >= exp * 1000
  } catch (error) {
    console.error('Ошибка при декодировании access токена:', error)
    return true
  }
}

async function refreshAccessToken(refreshToken: string, request: NextRequest) {
  try {
    const url = new URL('/api/auth/refresh', request.url).toString()
    const { data } = await axios.post(url, { refresh: refreshToken })
    return data
  } catch (error) {
    console.error('Ошибка при обновлении токена:')
    if (axios.isAxiosError(error)) {
      console.error(
        error.response?.data?.message ||
        error.message ||
        'Неизвестная ошибка'
      )
    }
    return null
  }
}


export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (accessToken && !isAccessTokenExpired(accessToken)) {
    return NextResponse.next()
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  const newTokens = await refreshAccessToken(refreshToken, request)
  if (!newTokens?.accessToken) {
    const response = NextResponse.redirect(new URL('/auth', request.url))
    ;(['accessToken', 'refreshToken'] as const).forEach((cookie) => {
      response.cookies.delete(cookie)
    })
    return response
  }

  const response = NextResponse.next()
  response.cookies.set({
    name: 'accessToken',
    value: newTokens.accessToken,
    sameSite: 'lax',
  })

  response.cookies.set({
    name: 'refreshToken',
    value: newTokens.refreshToken,
    sameSite: 'lax',
  })

  response.cookies.set({
    name: 'userID',
    value: newTokens.userID,
    sameSite: 'lax',
  })

  return response
}
