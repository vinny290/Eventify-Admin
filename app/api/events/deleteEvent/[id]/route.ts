import { NextResponse } from 'next/server'
import { cookies } from "next/headers"
import axios from 'axios'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params

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
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        return NextResponse.json(response.data)
    } catch (error) {
        console.error('Ошибка при удалении мероприятия:', error)

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