// app/api/v1/files/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Params } from "@/types/Params";

export async function GET(
  request: NextRequest,
  { params }: Params,
): Promise<NextResponse> {
  const { id } = await params;

  const accessToken = (await cookies()).get("accessToken")?.value;

  if (!accessToken) {
    console.log("API-роут: Отсутствует токен доступа");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Формируем URL для запроса к бэкенду
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/${id}`;
    // Запрос к API для получения конкретного файла по ID
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json(
        { error: `Ошибка при получении файла: ${errorMessage}` },
        { status: response.status },
      );
    }

    // Получаем файл как бинарные данные
    const imageData = await response.arrayBuffer();

    // Определяем тип контента из заголовков ответа
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Возвращаем изображение с правильным типом контента
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("API-роут: Ошибка сервера при получении файла", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
