import { useState, useEffect, useRef } from "react";

export function useImageById(id: string | null | undefined) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) {
      // если нет ID, очищаем предыдущий URL
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
      setImageUrl(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchImage = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
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
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (isMounted) {
          // очищаем предыдущий URL
          if (prevUrlRef.current) {
            URL.revokeObjectURL(prevUrlRef.current);
          }
          prevUrlRef.current = url;
          setImageUrl(url);
          setIsLoading(false);
        } else {
          // если уже размонтировано, сразу отозвать
          URL.revokeObjectURL(url);
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

    return () => {
      isMounted = false;
      controller.abort();
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
    };
  }, [id]);

  return { imageUrl, isLoading, error };
}
