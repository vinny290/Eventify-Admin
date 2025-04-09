// pages/EventsPage.tsx
"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useGetEvents } from "@/hook/events/useGetListEvents";
import EventImage from "@/components/custom/EventImage";
import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function EventsPage() {
  const { events, isLoading, errorGetListEvents, refetch } = useGetEvents();
  const router = useRouter();

  const handleCardClick = (id: string) => {
    router.push(`/event/${id}`);
  };

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
    );
  }

  if (errorGetListEvents) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 text-lg">{errorGetListEvents}</p>
        <Button onClick={() => refetch()}>Попробовать снова</Button>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Мероприятий не найдено</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {events.map((event: any) => (
        <Card
          key={event.id}
          className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg flex flex-col w-full max-w-[400px] mx-auto min-h-[500px]"
          onClick={() => handleCardClick(event.id)}
        >
          <div className="relative w-full aspect-video">
            <EventImage
              imageId={event.cover}
              alt={event.title}
              className="object-cover"
              fill
            />
          </div>
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="font-bold text-lg sm:text-xl line-clamp-2">
              {event.title}
            </CardTitle>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="outline" className="text-xs sm:text-sm">
                {format(new Date(event.start * 1000), "d MMMM yyyy", {
                  locale: ru,
                })}
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">
                {format(new Date(event.start * 1000), "HH:mm", {
                  locale: ru,
                })}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs sm:text-sm"
              >
                {event.location}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-2 flex-grow">
            <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
              {event.description}
            </p>
          </CardContent>
          <CardFooter className="px-4 pb-4 mt-auto">
            <Button className="w-full text-sm sm:text-base">Подробнее</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
