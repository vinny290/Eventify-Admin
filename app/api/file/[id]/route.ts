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
  const accessToken = (await cookies()).get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Запрос к API для получения конкретного файла по ID
    const response = await fetch(`${process.env.API_URL}/files/${id}`, {
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

    // Возвращаем изображение с правильным типом контента
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400", // Кэширование на 24 часа
      },
    });
  } catch (error) {
    console.error("Ошибка сервера при получении файла", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
