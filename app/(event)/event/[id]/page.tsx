"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Save, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useGetEventById from "@/hook/events/useGetEventById";
import { useDeleteEvent } from "@/hook/events/useDeleteEvent";
import { useEditEvent } from "@/hook/events/useEditEvent";
import { useUploadProfileImage } from "@/hook/files/useUpload";
import useGetEventCategories from "@/hook/categories/useGetEventCategories";

import EventImage from "@/components/custom/EventImage";
import eventStore from "@/stores/EventStore";
import { toast } from "sonner";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import MultiSelect from "@/components/custom/MultiSelect";
import useGetCategories from "@/hook/categories/useGetCategories";

const EventPage = observer(({ params }: { params: Promise<{ id: string }> }) => {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();

  const { event, loadingEventById, errorEventById } = useGetEventById(id);
  const { categories } = useGetEventCategories(event?.categories ?? []);
  const { categories: allCategories } = useGetCategories();
  const { deleteEvent } = useDeleteEvent();
  const { editEvent } = useEditEvent();
  const { uploadImage, loadingUpload } = useUploadProfileImage();

  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const categoryOptions = allCategories.map(cat => ({
    value: cat.id,
    label: cat.title
  }));

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const results = await uploadImage({ file: files[0] });
      if (results.length > 0) {
        eventStore.updateField("cover", results[0]);
      }
    } catch (err) {
      console.error("Ошибка загрузки обложки", err);
      toast.error("Ошибка загрузки обложки");
    }
  };

  useEffect(() => {
    if (event) {
      const eventWithMs = {
        ...event,
        start: event.start * 1000,
        end: event.end * 1000,
      };
      eventStore.setEvent(eventWithMs);
    }
  }, [event]);

  const handleSave = async () => {
    const changes = eventStore.changedFields;
    try {
      await editEvent(id, changes);
      toast.success("Изменения сохранены!");

      const updatedEvent = { ...eventStore.originalEvent, ...changes };
      if (changes.start !== undefined) {
        updatedEvent.start = changes.start * 1000;
      }
      if (changes.end !== undefined) {
        updatedEvent.end = changes.end * 1000;
      }
      eventStore.setEvent(updatedEvent);
      setIsEditing(false);
    } catch (error) {
      toast.error("Ошибка сохранения изменений");
      console.error(error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(id);
      toast.success("Мероприятие удалено!");
      router.push("/");
    } catch (err) {
      toast.error("Ошибка в удалении");
      console.error(err);
    }
  };

  const handleCategoriesChange = (selectedValues: string[]) => {
    eventStore.updateField("categories", selectedValues);
  };

  if (loadingEventById) {
    return (
      <div className="container max-w-4xl py-6 space-y-6 mx-auto">
        <Skeleton className="h-auto w-full rounded-lg mx-auto" />
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (errorEventById) {
    return (
      <div className="container max-w-4xl py-6 text-center text-destructive mx-auto">
        {errorEventById}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container max-w-4xl py-6 text-center mx-auto">
        Событие не найдено
      </div>
    );
  }

  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const rawCover = eventStore.originalEvent?.cover ?? event.cover;
  const coversArray = Array.isArray(rawCover)
    ? rawCover
    : [rawCover].filter(Boolean);

  const showPrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : coversArray.length - 1));
  const showNext = () =>
    setCurrentIndex((prev) => (prev < coversArray.length - 1 ? prev + 1 : 0));

  return (
    <div className="container max-w-screen-lg py-8 md:py-16 px-4 mx-auto">
      {/* Модальное окно редактирования */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-[95vw] md:max-w-[600px] dark:bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">Редактирование события</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-light">Название</Label>
              <Input
                id="title"
                value={eventStore.editedEvent.title || ""}
                onChange={(e) => eventStore.updateField("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-light">Обложка</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
              />
              {loadingUpload && <p className="text-sm">Загрузка обложки...</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-light">Описание</Label>
              <Textarea
                id="description"
                value={eventStore.editedEvent.description || ""}
                onChange={(e) =>
                  eventStore.updateField("description", e.target.value)
                }
                rows={8}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs font-light">Дата начала события</Label>
                <Input
                  id="date"
                  type="date"
                  value={format(new Date(eventStore.editedEvent.start || 0), "yyyy-MM-dd")}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    const time = new Date(eventStore.editedEvent.start || 0);
                    date.setHours(time.getHours(), time.getMinutes());
                    eventStore.updateField("start", date.getTime());
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-xs font-light">Время начала события</Label>
                <Input
                  id="time"
                  type="time"
                  value={format(new Date(eventStore.editedEvent.start || 0), "HH:mm")}
                  onChange={(e) => {
                    const timeParts = e.target.value.split(":");
                    const date = new Date(eventStore.editedEvent.start || 0);
                    date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
                    eventStore.updateField("start", date.getTime());
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Место проведения</Label>
              <Input
                id="location"
                value={eventStore.editedEvent.location || ""}
                onChange={(e) =>
                  eventStore.updateField("location", e.target.value)
                }
              />
            </div>

            <div className="space-y-2 w-full">
              <Label>Категория</Label>
              <MultiSelect
                options={categoryOptions}
                selectedValues={eventStore.editedEvent.categories || []}
                setSelectedValues={handleCategoriesChange}
                placeholder="Выберите категории..."
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
              <Button
                variant="destructive"
                onClick={handleDeleteEvent}
                className="gap-2"
              >
                Удалить событие
              </Button>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Основной контент страницы */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Левая часть */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center gap-2 sm:gap-3">
          <div className="relative w-full max-w-[300px] sm:max-w-[400px] aspect-[1/1] rounded-xl sm:rounded-2xl md:rounded-[30px] overflow-hidden">
            <EventImage
              imageId={coversArray[currentIndex]}
              alt={eventStore.originalEvent?.title || event.title}
              fill
              className="object-cover"
            />

            {coversArray.length > 1 && (
              <>
                <button
                  onClick={showPrev}
                  className="absolute top-1/2 left-1 sm:left-2 -translate-y-1/2 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-base"
                >
                  ◀
                </button>
                <button
                  onClick={showNext}
                  className="absolute top-1/2 right-1 sm:right-2 -translate-y-1/2 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-base"
                >
                  ▶
                </button>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center w-full mt-1 sm:mt-2">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full"
                style={{ backgroundColor: cat.color || "#f3f4f6" }}
              >
                <p className="text-black font-medium">{cat.title}</p> 
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-3/4 lg:w-full mt-2 sm:mt-4">
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full bg-primary px-4 py-2 sm:px-6 sm:py-3 font-semibold text-sm sm:text-base"
            >
              Редактировать
            </Button>
            
          </div>

          <div className="w-full space-y-1 sm:space-y-2 mt-4 sm:mt-6 md:mt-8">
            <h3 className="text-sm sm:text-m font-raleway-samibold text-[#808080] text-left">
              Организатор
            </h3>
            <div className="border-t-2 border-[D9D9D9] mt-1 sm:mt-2" />
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm md:text-base">ITAM</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs sm:text-sm md:text-base font-bold text-foreground">
                  IT At MISIS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Правая часть */}
        <div className="w-full lg:w-2/3 flex justify-end lg:pl-6 mt-6 lg:mt-0">
          <div className="w-full flex flex-col items-start gap-4 md:gap-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {eventStore.originalEvent?.title || event.title}
            </h1>

            <div className="space-y-3 mt-2 font-raleway text-left w-full">
              <div className="flex items-start gap-3">
                <img
                  src="/images/calendar.svg"
                  alt="Clock Icon"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mt-1 flex-shrink-0"
                />
                <div className="text-sm sm:text-base text-foreground w-full break-words">
                  <div className="font-semibold text-base sm:text-lg leading-tight">
                    {capitalizeFirstLetter(
                      format(
                        new Date(eventStore.originalEvent?.start || event.start || 0),
                        "EEEE, d MMMM",
                        { locale: ru }
                      )
                    )}
                  </div>
                  <div className="font-semibold text-base sm:text-lg">
                    {format(
                      new Date(eventStore.originalEvent?.start || event.start || 0),
                      "HH:mm"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <img
                  src="/images/location.svg"
                  alt="Location Icon"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mt-1"
                />
                <span className="block max-w-full font-semibold text-base sm:text-lg mt-1">
                  {eventStore.originalEvent?.location ||
                    event.location ||
                    "Место не указано"}
                </span>
              </div>
            </div>

            <div className="w-full space-y-4 mt-4 md:mt-6">
              <h3 className="text-lg font-semibold text-[#808080] text-left">
                О событии
              </h3>
              <div className="border-t-2 border-[D9D9D9] mt-2 md:mt-4" />
              <p className="whitespace-pre-line text-foreground leading-relaxed text-left font-raleway text-sm sm:text-base">
                {eventStore.originalEvent?.description ||
                  event.description ||
                  "Описание отсутствует"}
              </p>
              <div className="border-b-2 border-[D9D9D9] mt-4 md:mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EventPage;