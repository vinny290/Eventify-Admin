import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: Request) {
  try {
    const { refresh } = await req.json()

    const { data, status } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth`,
      { refresh },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    )

    return NextResponse.json({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    }, { status })
    
  } catch (error) {
    console.error('Internal server error:')
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || 'Internal server error'
      console.error(`Status: ${status}, Message: ${message}`)
      return NextResponse.json({ message }, { status })
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}