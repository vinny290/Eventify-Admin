import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  // Получаем accessToken из cookies, который устанавливается AuthStore
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized: Токен не предоставлен" },
      { status: 401 },
    );
  }

  try {
    // Получаем URL текущего запроса
    const { searchParams } = new URL(request.url);

    // Формируем URL API с query-параметрами
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/events`);

    // Копируем все параметры из запроса в API URL
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json(
        { error: `Ошибка при получении данных: ${errorMessage}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
