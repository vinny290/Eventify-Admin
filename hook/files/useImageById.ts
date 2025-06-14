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
  id: string | null | undefined
): UseImageByIdResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Если ID не предоставлен, не выполняем запрос
    if (!id) {
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

        const response = await fetch(requestUrl, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Ошибка загрузки изображения: ${response.status} - ${errorText}`
          );
        }

        // Получаем данные как Blob
        const blob = await response.blob();

        // Создаем временный URL для Blob
        const url = URL.createObjectURL(blob);

        if (isMounted) {
          setImageUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
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
