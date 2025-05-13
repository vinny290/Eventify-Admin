import { NextResponse } from 'next/server'
import { cookies } from "next/headers"
import axios from 'axios'

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params
    const body = await request.json()

    if (!id) {
        return NextResponse.json(
            { error: "Не указан ID события" },
            { status: 400 }
        )
    }

    const accessToken = (await cookies()).get("accessToken")?.value
    if (!accessToken) {
        return NextResponse.json(
            { error: "Unauthorized: Токен не предоставлен" },
            { status: 401 }
        )
    }

    try {
        const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        return NextResponse.json(response.data)
    } catch (error) {
        // Улучшенное логирование ошибок
        console.error('Full error details:', error)

        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.error || 'Ошибка сервера' },
                { status: error.response?.status || 500 }
            )
        }

        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        )
    }
}