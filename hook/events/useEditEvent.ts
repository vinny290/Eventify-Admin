"use client"
import axios from 'axios';

export function useEditEvent() {
  const editEvent = async (id: string, eventData: any) => {
    try {
      const response = await axios.patch(`/api/events/editEvent/${id}`, eventData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Ошибка в редактировании мероприятия');
      } else {
        throw new Error('Произошла непредвиденная ошибка');
      }
    }
  };

  return { editEvent };
}