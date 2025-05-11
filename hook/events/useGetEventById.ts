"use client"

import { Event } from "@/types/Event";
import { useState, useEffect } from 'react'
import axios from 'axios'

const useGetEventById = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null)
  const [loadingEventById, setLoadingEventById] = useState<boolean>(true)
  const [errorEventById, setErrorEventById] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setErrorEventById('Не указан ID события')
        setLoadingEventById(false)
        return
      }

      try {
        const response = await axios.get<Event>(`/api/events/getEventById/${id}`)
        setEvent(response.data)
        setErrorEventById(null)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setErrorEventById('Unauthorized: Недействительный или просроченный токен')
          } else if (err.response?.status === 404) {
            setErrorEventById('Событие не найдено')
          } else {
            setErrorEventById('Ошибка при загрузке события')
          }
        } else {
          setErrorEventById('Неизвестная ошибка')
        }
        console.error('Error fetching event:', err)
      } finally {
        setLoadingEventById(false)
      }
    }

    fetchEvent()
  }, [id])

  return { event, loadingEventById, errorEventById }
}

export default useGetEventById