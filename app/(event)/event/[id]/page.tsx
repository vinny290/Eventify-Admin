"use client"
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useGetEventById from '@/hook/events/useGetEventById'
import EventImage from '@/components/custom/EventImage'
import React from 'react'

const EventPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const unwrappedParams = React.use(params)
  const { id } = unwrappedParams

  const { event, loadingEventById, errorEventById } = useGetEventById(id)

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'd MMMM yyyy', { locale: ru })
  }

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'HH:mm', { locale: ru })
  }

  if (loadingEventById) {
    return (
      <div className="container max-w-4xl py-6 space-y-6 mx-auto">
        <Skeleton className="h-64 w-full rounded-lg mx-auto" />
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-1/3 mx-auto" />
        </div>
      </div>
    )
  }

  if (errorEventById) {
    return (
      <div className="container max-w-4xl py-6 text-center text-destructive mx-auto">
        {errorEventById}
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container max-w-4xl py-6 text-center mx-auto">
        Событие не найдено
      </div>
    )
  }

  return (
    <div className="container max-w-screen-2xl py-6 space-y-8 mx-auto">
      {/* Обложка события */}
      <div className="relative aspect-video mx-auto max-w-5xl">
        <EventImage
          imageId={event.cover}
          alt={event.title}
          fill
          className="rounded-lg"
        />
      </div>

      {/* Заголовок и кнопка подписки */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-around text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
        <Button size="lg" className="w-full md:w-auto">
          {event.subscribed ? 'Отписаться' : 'Участвовать'}
        </Button>
      </div>

      {/* Основная информация */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Детали события */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <CalendarDays className="w-5 h-5 text-muted-foreground" />
            <span>{formatDate(event.start)}</span>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span>
              {formatTime(event.start)} – {formatTime(event.end)}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-start">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <span>{event.location}</span>
          </div>

          {event.capacity > 0 && (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span>
                {event.capacity - (event.subscribed ? 1 : 0)} / {event.capacity}{' '}
                мест
              </span>
            </div>
          )}
        </div>

        {/* Описание */}
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-semibold">Описание</h3>
          <p className="text-muted-foreground whitespace-pre-line">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventPage