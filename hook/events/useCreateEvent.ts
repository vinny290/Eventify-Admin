import { useState } from 'react';
import axios from 'axios';

export const useCreateEvent = () => {
  const [loadingCreateEvent, setLoadingCreateEvent] = useState(false);
  const [errorCreateEvent, setErrorCreateEvent] = useState<string | null>(null);

  const createEvent = async (eventData: {
    title: string;
    cover: string;
    pictures: string[];
    description: string;
    start: number | string;
    end: number | string;
    location: string;
    categories: string[];
    organizationID: string;
  }) => {
    setLoadingCreateEvent(true);
    setErrorCreateEvent(null);

    try {
      const response = await axios.post('/api/events/create', eventData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.id) {
        return response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let message = 'Ошибка при создании ивента';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.error || message;
      }
      setErrorCreateEvent(message);
      throw new Error(message);
    } finally {
        setLoadingCreateEvent(false);
    }
  };

  return { createEvent, loadingCreateEvent, errorCreateEvent };
};
