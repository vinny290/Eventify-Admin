// app/api/v1/files/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: Params,
): Promise<NextResponse> {
  const { id } = params;
  console.log(`API-роут: Получен запрос на файл с ID: ${id}`);

  const accessToken = (await cookies()).get("accessToken")?.value;

  if (!accessToken) {
    console.log("API-роут: Отсутствует токен доступа");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Формируем URL для запроса к бэкенду
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/${id}`;
    console.log(`API-роут: Запрос к бэкенду: ${apiUrl}`);

    // Запрос к API для получения конкретного файла по ID
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    console.log(`API-роут: Статус ответа от бэкенда: ${response.status}`);

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`API-роут: Ошибка от бэкенда: ${errorMessage}`);
      return NextResponse.json(
        { error: `Ошибка при получении файла: ${errorMessage}` },
        { status: response.status },
      );
    }

    // Получаем файл как бинарные данные
    const imageData = await response.arrayBuffer();
    console.log(
      `API-роут: Получены данные размером: ${imageData.byteLength} байт`,
    );

    // Определяем тип контента из заголовков ответа
    const contentType = response.headers.get("content-type") || "image/jpeg";
    console.log(`API-роут: Тип контента: ${contentType}`);

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
