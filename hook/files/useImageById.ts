// hooks/useImageById.ts
import { useState, useEffect } from "react";

interface UseImageByIdResult {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Хук для получения изображения по ID
 * @param id - ID изображения для загрузки
 * @returns Объект с данными изображения, состоянием загрузки и ошибкой
 */
export function useImageById(
  id: string | null | undefined,
): UseImageByIdResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Если ID не предоставлен, не выполняем запрос
    if (!id) {
      console.log("Хук: ID не предоставлен, запрос не выполняется");
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchImage = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // Исправляем путь для соответствия API-роуту
        const requestUrl = `/api/file/${id}`;
        console.log(`Хук: Запрос изображения по URL: ${requestUrl}`);

        const response = await fetch(requestUrl, {
          signal: controller.signal,
          cache: "no-store",
        });

        console.log(`Хук: Получен ответ со статусом: ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Хук: Ошибка ответа: ${errorText}`);
          throw new Error(
            `Ошибка загрузки изображения: ${response.status} - ${errorText}`,
          );
        }

        // Получаем данные как Blob
        const blob = await response.blob();
        console.log(
          `Хук: Получен blob размером: ${blob.size} байт, тип: ${blob.type}`,
        );

        // Создаем временный URL для Blob
        const url = URL.createObjectURL(blob);
        console.log(`Хук: Создан URL объекта: ${url}`);

        if (isMounted) {
          setImageUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Хук: Запрос был отменен");
          return;
        }

        console.error("Хук: Ошибка при загрузке изображения:", err);

        if (isMounted) {
          setError(err instanceof Error ? err.message : "Неизвестная ошибка");
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    // Очистка при размонтировании компонента
    return () => {
      console.log(`Хук: Очистка ресурсов для ID: ${id}`);
      isMounted = false;
      controller.abort();

      // Освобождаем URL, если он был создан
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]);

  return { imageUrl, isLoading, error };
}
