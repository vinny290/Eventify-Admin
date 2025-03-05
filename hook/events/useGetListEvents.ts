// useGetEvents.ts
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface GetEventsResult {
  events: Event[] | null;
  isLoading: boolean;
  errorGetListEvents: string | null;
  refetch: () => void;
}

export function useGetEvents(): GetEventsResult {
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

      const response = await fetch("/api/events/list-events", {
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
  }, []);

  const refetch = () => {
    fetchEvents();
  };

  return { events, isLoading, errorGetListEvents, refetch };
}
