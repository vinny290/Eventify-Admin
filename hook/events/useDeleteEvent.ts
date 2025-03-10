"use client"
import axios from 'axios';

export function useDeleteEvent() {
  const deleteEvent = async (id: string) => {
    try {
      const response = await axios.delete(`/api/events/deleteEvent/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Ошибка в удалении теста');
      } else {
        throw new Error('Произошла непредвиденная ошибка');
      }
    }
  };

  return { deleteEvent };
}