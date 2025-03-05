// pages/EventsPage.tsx
"use client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useGetEvents } from "@/hook/events/useGetListEvents"
import EventImage from "@/components/custom/EventImage"
import React from "react"
import { useRouter } from 'next/navigation'

export default function EventsPage() {
  const { events, isLoading, errorGetListEvents, refetch } = useGetEvents()
  const router = useRouter()


  const handleCardClick = (id: string) => {
    router.push(`/event/${id}`)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-[200px] w-full rounded-md mb-4" />
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (errorGetListEvents) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 text-lg">{errorGetListEvents}</p>
        <Button onClick={() => refetch()}>Попробовать снова</Button>
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Мероприятий не найдено</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {events.map((event: any) => (
        <Card
          key={event.id}
          className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => handleCardClick(event.id)}
        >
          <div className="p-0 h-[250px]">
            <EventImage
              imageId={event.cover}
              alt={event.title}
              fill
            />
          </div>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>
              {format(new Date(event.start * 1000), "d MMMM yyyy, HH:mm", {
                locale: ru,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-3">
              {event.description}
            </p>
            <div className="mt-4">
              <p className="text-sm font-medium">Место:</p>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant={event.subscribed ? "secondary" : "default"}
              className="w-full"
            >
              {event.subscribed ? "Вы записаны" : "Записаться"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
