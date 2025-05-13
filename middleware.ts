import axios from 'axios'
import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
}


function isAccessTokenExpired(accessToken: string): boolean {
  try {
    const parts = accessToken.split('.');
    if (parts.length !== 3) {
      console.error('Токен не является JWT');
      return true;
    }
    const payloadEncoded = parts[1];
    
    // Конвертируем base64url в base64
    let base64 = payloadEncoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Добавляем padding
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const payloadStr = Buffer.from(base64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadStr);
    const exp = payload.exp;
    
    if (!exp) return true;
    
    // Сравниваем в секундах
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return nowInSeconds >= exp;
  } catch (error) {
    console.error('Ошибка при декодировании access токена:', error);
    return true;
  }
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth`,
      { refresh: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );
    console.log("Токен успешно обновлен")
    return data;
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error);
    if (axios.isAxiosError(error)) {
      console.error('Ответ сервера:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    return null;
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

  const newTokens = await refreshAccessToken(refreshToken)
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
    path: '/',
  })

  response.cookies.set({
    name: 'refreshToken',
    value: newTokens.refreshToken,
    sameSite: 'lax',
    path: '/',
  })

  response.cookies.set({
    name: 'userID',
    value: newTokens.userID,
    sameSite: 'lax',
  })

  return response
}
