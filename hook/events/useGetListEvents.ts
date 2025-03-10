// useGetEvents.ts
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface Event {
  // Здесь должно быть определение типа Event
  // Добавьте необходимые поля в соответствии с вашей моделью данных
  id: string;
  [key: string]: any;
}

interface EventsQueryParams {
  organizationID?: string;
  [key: string]: string | undefined;
}

interface GetEventsResult {
  events: Event[] | null;
  isLoading: boolean;
  errorGetListEvents: string | null;
  refetch: () => void;
}

export function useGetEvents(params?: EventsQueryParams): GetEventsResult {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorGetListEvents, setErrorGetListEvents] = useState<string | null>(
    null,
  );

  const fetchEvents = async () => {
    setIsLoading(true);
    setErrorGetListEvents(null);
    try {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        setErrorGetListEvents("Вы не авторизованы: выполните вход.");
        return;
      }

      // Формируем URL с query-параметрами
      let url = "/api/events/list-events";

      if (params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const queryString = queryParams.toString();
        if (queryString) {
          url = `${url}?${queryString}`;
        }
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorGetListEvents(
          errorData.error || "Ошибка при получении событий",
        );
        return;
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setErrorGetListEvents("Не удалось загрузить события");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [JSON.stringify(params)]); // Зависимость от параметров запроса

  const refetch = () => {
    fetchEvents();
  };

  return { events, isLoading, errorGetListEvents, refetch };
}
