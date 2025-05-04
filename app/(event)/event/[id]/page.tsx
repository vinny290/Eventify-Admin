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
  const currentCover = isEditing
    ? eventStore.editedEvent.cover || eventStore.originalEvent?.cover || event.cover
    : eventStore.originalEvent?.cover || event.cover;

  return (
    <div className="container max-w-screen-lg py-10 px-4 mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* Левая часть */}
        <div className="w-full md:w-1/3 flex flex-col items-center gap-3">
          <div className="relative w-full aspect-[1/1] rounded-[30px] overflow-hidden">
            <EventImage
            imageId={currentCover}
            alt={eventStore.originalEvent ? eventStore.originalEvent.title : event.title}
            fill
            className="object-cover"
            />
          </div>

          {/* Теги */}
          <div className="flex flex-wrap gap-3 justify-right">
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
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
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
              <h3 className="text-sm font-semibold text-[#808080] text-left">Организатор</h3>

              <div className="border-t-2 border-[D9D9D9] mt-2" />
                <div className="flex items-center gap-4 mt-2"> 
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-white text">ITAM</span>
                  </div>
                <div className="flex flex-col justify-center">
                <span className="text-base font-medium text-foreground">IT At MISIS</span>
                </div>
              </div>
          </div> 
        </div> 

        {/* Загрузка новой обложки в режиме редактирования */}
        {isEditing && (
          <div className="flex flex-col items-center w-1/3 mx-auto">
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="mx-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {loadingUpload && <p className="mt-2">Загрузка обложки...</p>}
            {errorUpload && <p className="mt-2 text-red-500">{errorUpload}</p>}
          </div>
        )}
        <div className="w-full md:w-1 flex flex-col items-center justify-start gap-6"></div>

        {/* Правая часть */}
        <div className="w-full flex justify-end">
            <div className="w-full md:w-10/2 flex flex-col items-center justify-start gap-6">

            {/* Заголовок события */}
            <div className="w-full text-left">
              {isEditing ? (
                <Input
                  value={eventStore.editedEvent.title || ''}
                  onChange={(e) => eventStore.updateField('title', e.target.value)}
                  className="text-3xl font-bold bg-background border-primary/30 hover:border-primary/50 text-center w-full"
                />
              ) : (
                  <h1 className="text-5xl font-bold tracking-tight text-foreground">
                    {eventStore.originalEvent ? eventStore.originalEvent.title : event.title}
                    </h1>
                  )}
              </div>

            {/* Время события */}
            <div className="w-full space-y-2">
              <div className="flex items-start gap-3 justify-center">
                <Clock className="w-5 h-5 text-muted-foreground mt-1" />
                {isEditing ? (
                  <>
                    <Input
                      type="datetime-local"
                      value={utcToLocal(eventStore.editedEvent.start || 0)}
                      onChange={(e) =>
                        eventStore.updateField('start', new Date(e.target.value).getTime())
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-background"
                    />
                    <span className="text-muted-foreground">–</span>
                    <Input
                      type="datetime-local"
                      value={utcToLocal(eventStore.editedEvent.end || 0)}
                      onChange={(e) =>
                        eventStore.updateField('end', new Date(e.target.value).getTime())
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-background"
                    />
                  </>
                ) : (
                  <>
                    <span onClick={() => setIsEditing(true)} className="cursor-pointer">
                      {formatDateTime(
                        eventStore.originalEvent
                          ? eventStore.originalEvent.start!
                          : event.start!
                      )}
                    </span>
                    <span className="text-muted-foreground">–</span>
                    <span onClick={() => setIsEditing(true)} className="cursor-pointer">
                      {formatDateTime(
                        eventStore.originalEvent
                          ? eventStore.originalEvent.end!
                          : event.end!
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Описание события */}
            <div className="w-full space-y-4">
              <h3 className="text-lg font-semibold text-[#808080] text-left">О событии</h3>
              <div className="border-t-2 border-[D9D9D9] mt-6" />
              {isEditing ? (
                <Textarea
                  value={eventStore.editedEvent.description || ''}
                  onChange={(e) => eventStore.updateField('description', e.target.value)}
                  rows={6}
                  className="bg-background border-primary/30 hover:border-primary/50 resize-none w-full"
                  placeholder="Добавьте подробное описание мероприятия..."
                />
              ) : (
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-left">
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
