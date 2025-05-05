"use client";

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';

import { Clock, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

import useGetEventById from '@/hook/events/useGetEventById';
import { useDeleteEvent } from '@/hook/events/useDeleteEvent';
import { useEditEvent } from '@/hook/events/useEditEvent';
import { useUploadProfileImage } from '@/hook/files/useUpload';

import EventImage from '@/components/custom/EventImage';
import eventStore from '@/stores/EventStore';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/formatDateTime';
import { utcToLocal } from '@/lib/time-picker';
import useGetCategories from '@/hook/events/useGetCategories';


import { format } from "date-fns";
import { ru } from "date-fns/locale";

const EventPage = observer(({ params }: { params: Promise<{ id: string }> }) => {
  // Извлекаем параметры и инициализируем роутер
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();

  // Получаем данные события и состояния загрузки/ошибок
  const { event, loadingEventById, errorEventById } = useGetEventById(id);
  const { deleteEvent } = useDeleteEvent();
  const { editEvent } = useEditEvent();
  const { uploadImage, loadingUpload, errorUpload } = useUploadProfileImage();

  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);


  // Обработка загрузки обложки события
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const results = await uploadImage({ file: files[0] });
      if (results.length > 0) {
        eventStore.updateField('cover', results[0]);
      }
    } catch (err) {
      console.error("Ошибка загрузки обложки", err);
      toast.error("Ошибка загрузки обложки");
    }
  };

  // Синхронизируем событие с состоянием хранилища
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

  // Переключение режима редактирования
  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };

  // Сохранение изменений события
  const handleSave = async () => {
    const changes = eventStore.changedFields;
    try {
      await editEvent(id, changes);
      toast.success('Изменения сохранены!');

      // Приводим время к миллисекундам, если оно изменилось
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
      toast.error('Ошибка сохранения изменений');
      console.error(error);
    }
  };

  // Удаление события
  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(id);
      toast.success('Мероприятие удалено!');
      router.push('/');
    } catch (err) {
      toast.error('Ошибка в удалении');
      console.error(err);
    }
  };

  // Рендер состояний загрузки, ошибок и отсутствия события
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


  // Определяем текущую обложку события

  // Утилита для капитализации
function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Получаем список обложек и нормализуем в массив
const rawCover = isEditing
  ? eventStore.editedEvent.cover ?? eventStore.originalEvent?.cover
  : eventStore.originalEvent?.cover ?? event.cover;

const coversArray = Array.isArray(rawCover) ? rawCover : [rawCover].filter(Boolean);

// Перелистывание
const showPrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : coversArray.length - 1));
const showNext = () => setCurrentIndex((prev) => (prev < coversArray.length - 1 ? prev + 1 : 0));

  return (
    <div className="container max-w-screen-lg py-16 px-4 mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* Левая часть */}
        <div className="w-full md:w-1/3 flex flex-col items-center gap-3">
          <div className="relative w-full aspect-[1/1] rounded-[30px] overflow-hidden">
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
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
              >
                ◀
              </button>
              <button
                onClick={showNext}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
              >
                ▶
              </button>
            </>
          )}
          </div>

          {/* Загрузка новой обложки в режиме редактирования */}
          {isEditing && (
              <div className="w-full flex flex-col text-center items-center p-0">
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="p-2 bg-background border-primary/30 hover:border-primary/50 text-center w-full"
                />
                {loadingUpload && <p className="mt-2">Загрузка обложки...</p>}
                {errorUpload && <p className="mt-2 text-red-500">{errorUpload}</p>}
              </div>
            )}

          {/* Теги */}
          <div className="flex flex-wrap gap-3 justify-right mt-2">
              {["DevOps", "Cloud", "ITCommunity", "SoftwareEngineering", "Development"].map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full bg-muted text-foreground border"
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* Кнопки управления событием */}
          <div className="flex flex-wrap gap-2 w-full mt-3 md:w-auto">
              <Button
                style={{
                  width: isEditing ? 156 : 330,
                  height: 40,
                }}
                onClick={isEditing ? handleSave : handleEditToggle}
                className="w-full md:w-auto bg-primary px-6 py-3 font-semibold"
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить
                  </>
                ) : (
                  'Редактировать'
                )}
              </Button>
            
              {isEditing && (
                <Button
                  variant="outline"
                  style={{
                    width: 155,
                    height: 40,
                  }}
                  onClick={() => setIsEditing(false)}
                  className="w-full md:w-auto border-destructive text-destructive hover:bg-destructive/10"
                >
                  <X className="mr-2 h-4 w-4" />
                  Отмена
                </Button>
              )}
          </div>

            <div className="flex justify-center md:justify-end w-full md:w-auto">
              <Button
                style={{
                  width: 330,
                  height: 40
                }}
                variant="destructive"
                onClick={handleDeleteEvent}
                className="w-full md:w-auto"
              >
                Удалить
              </Button>
            </div>

            {/* Информация об организаторе */}
            <div className="w-full space-y-2 mt-8">
              <h3 className="text-m font-raleway-samibold text-[#808080] text-left">Организатор</h3>

              <div className="border-t-2 border-[D9D9D9] mt-2" />
                <div className="flex items-center gap-4 mt-2"> 
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-white text">ITAM</span>
                  </div>
                <div className="flex flex-col justify-center">
                <span className="text-base font-bold text-foreground">IT At MISIS</span>
                </div>
              </div>
          </div> 
        </div> 

        {/* Правая часть */}
        <div className="w-full flex justify-end pl-6">
            <div className="w-full md:w-2xl flex flex-col items-start gap-6">


            {/* Заголовок события */}
            <div className="w-full text-left font-raleway">
              {isEditing ? (
                <Input
                  value={eventStore.editedEvent.title || ''}
                  onChange={(e) => eventStore.updateField('title', e.target.value)}
                  className="h-16 text-4xl font-bold bg-background border-primary/40 hover:border-primary/60 text-left p-4 w-full"
                />
              ) : (
                  <h1 className="text-5xl font-bold tracking-tight text-foreground">
                    {eventStore.originalEvent ? eventStore.originalEvent.title : event.title}
                    </h1>
                  )}
              </div>

            <div className="space-y-2 mt-3 font-raleway text-left">
              {/* Блок даты и времени */}
              <div className="flex items-start gap-3 max-w-md">
                <img 
                  src="/images/calendar.svg"
                  alt="Clock Icon"
                  className="w-12 h-12 mt-0 flex-shrink-0"
                />

                <div className="text-sm text-foreground w-full break-words">
                  {isEditing ? (
                    <Input
                      type="datetime-local"
                      value={utcToLocal(eventStore.editedEvent.start || 0)}
                      onChange={(e) =>
                        eventStore.updateField('start', new Date(e.target.value).getTime())
                      }
                      className="w-full max-w-xs px-3 py-3 border rounded-md bg-background text-lg mt-1"
                    />
                  ) : (
                    <>
                        <div className="font-semibold text-lg leading-tight mt-1">
                        {capitalizeFirstLetter(
                          format(new Date(eventStore.originalEvent?.start || event.start || 0), "EEEE, d MMMM", { locale: ru })
                        )}
                        </div>
                        <div className="font-semibold text-lg">
                          {format(new Date(eventStore.originalEvent?.start || event.start || 0), "HH:mm")}
                        </div>
                  </>
                  )}
                </div>
              </div>

              {/* Блок места */}
              <div className="flex items-center gap-3 max-w-md">
                <img 
                  src="/images/location.svg"
                  alt="Location Icon"
                  className="w-12 h-12 mt-3" 
                />
                {isEditing ? (
                  <Input
                    type="text"
                    value={eventStore.editedEvent.location || ''}
                    onChange={(e) => eventStore.updateField('location', e.target.value)}
                    placeholder="Введите место"
                    className="w-full max-w-xs px-3 py-2 border rounded-md bg-background text-lg mt-1"
                  />
                ) : (
                  <span className="block max-w-full font-semibold text-lg mt-3">
                    {eventStore.originalEvent?.location || event.location || 'Место не указано'}
                  </span>
                )}
              </div>
            </div>

            {/* Описание события */}
            <div className="w-full space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-[#808080] text-left">О событии</h3>
              <div className="border-t-2 border-[D9D9D9] mt-6" />
              {isEditing ? (
                <Textarea
                  value={eventStore.editedEvent.description || ''}
                  onChange={(e) => eventStore.updateField('description', e.target.value)}
                  rows={12}
                  className="bg-background border-primary/30 hover:border-primary/50 resize-none w-full font-raleway text-base text-[#000000] placeholder-[#808080] focus:outline-none"
                  placeholder="Добавьте подробное описание мероприятия..."
                />
              ) : (
                <p className=" whitespace-pre-line text-[#000000] leading-relaxed text-left font-raleway">
                  {eventStore.originalEvent
                    ? eventStore.originalEvent.description || 'Описание отсутствует'
                    : event.description || 'Описание отсутствует'}
                </p>
              )}
              <div className="border-b-2 border-[D9D9D9] mt-6" />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
});

export default EventPage;
