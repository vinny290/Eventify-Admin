"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetCategories from "@/hook/events/useGetCategories";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUploadProfileImage } from "@/hook/files/useUpload";
import { useCreateEvent } from "@/hook/events/useCreateEvent";
import ImageByIdComponent from "@/components/custom/events/ImageByIdComponent";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

const EventCreatePage = () => {
  const router = useRouter();
  const [eventData, setEventData] = useState({
    title: "",
    cover: "",
    pictures: [] as string[],
    description: "",
    start: "",
    end: "",
    location: "",
    categories: [] as string[],
    organizationID: "708dee71-9744-4167-b82b-d337381b79c8",
  });

  const { categories, loadingGetListCategories, errorGetListCategories } =
    useGetCategories();
  const { uploadImage, loadingUpload, errorUpload } = useUploadProfileImage();
  const { createEvent, loadingCreateEvent, errorCreateEvent } =
    useCreateEvent();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    if (!eventData.categories.includes(value)) {
      setEventData((prevState) => ({
        ...prevState,
        categories: [...prevState.categories, value],
      }));
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setEventData((prevState) => ({
      ...prevState,
      categories: prevState.categories.filter((id) => id !== categoryId),
    }));
  };

  const handleRemoveImage = (index: number) => {
    setEventData((prevState) => ({
      ...prevState,
      pictures: prevState.pictures.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files).slice(
      0,
      5 - eventData.pictures.length,
    );

    try {
      const results = await Promise.all(
        filesArray.map((file) => uploadImage({ file })),
      );

      const newIds = results.flat();

      setEventData((prev) => ({
        ...prev,
        cover: prev.cover || newIds[0] || "",
        pictures: [...prev.pictures, ...newIds].slice(0, 5),
      }));
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdEvent = await createEvent({
        ...eventData,
        start: new Date(eventData.start).getTime() / 1000,
        end: new Date(eventData.end).getTime() / 1000,
      });
      console.log("Созданный ивент:", createdEvent);
      toast.success("Мероприятие создано!");
      router.push("/");
    } catch (err) {
      toast.error(errorCreateEvent || "Ошибка в создании");
      console.error(err);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-10 bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border-none">
      <div className="flex mb-6 gap-5">
        <button
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="h-8 w-8 mt-1" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Создание события
        </h1>
      </div>
      <form className="space-y-6 w-full" onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="title" className="text-gray-600 font-medium">
            Название
          </Label>
          <Input
            type="text"
            name="title"
            placeholder="Введите название события"
            value={eventData.title}
            onChange={handleChange}
            className="w-full p-3 border-none bg-gray-100 rounded-lg"
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="cover" className="text-gray-600 font-medium">
            Обложка
          </Label>
          <Input
            id="cover"
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border-none bg-gray-100 rounded-lg"
            accept="image/*"
          />
          {loadingUpload && <p>Загрузка изображения...</p>}
          {errorUpload && <p className="text-red-500">{errorUpload}</p>}
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="description" className="text-gray-600 font-medium">
            Описание
          </Label>
          <Textarea
            name="description"
            placeholder="Введите описание события"
            value={eventData.description}
            onChange={handleChange}
            className="w-full p-3 border-none bg-gray-100 rounded-lg"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="start" className="text-gray-600 font-medium">
            Дата начала события
          </Label>
          <Input
            type="datetime-local"
            name="start"
            value={eventData.start}
            onChange={handleChange}
            className="w-full p-3 border-none bg-gray-100 rounded-lg"
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="end" className="text-gray-600 font-medium">
            Дата окончания события
          </Label>
          <Input
            type="datetime-local"
            name="end"
            value={eventData.end}
            onChange={handleChange}
            className="w-full p-3 border-none bg-gray-100 rounded-lg"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="location" className="text-gray-600 font-medium">
            Место проведения
          </Label>
          <Input
            type="text"
            name="location"
            placeholder="Например: НИТУ МИСИС, Б-827"
            value={eventData.location}
            onChange={handleChange}
            className="w-full p-3 border-none bg-gray-100 rounded-lg"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="categories" className="text-gray-600 font-medium">
            Категории
          </Label>
          {loadingGetListCategories ? (
            <p>Загрузка категорий...</p>
          ) : errorGetListCategories ? (
            <p className="text-red-500">{errorGetListCategories}</p>
          ) : (
            <>
              <Select value="" onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full p-3 border-none bg-gray-100 rounded-lg">
                  <SelectValue placeholder="Выберите категории" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {eventData.categories.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return (
                    <div
                      key={categoryId}
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: category?.color
                          ? `${category.color}`
                          : `#242424`,
                      }}
                    >
                      <span>{category?.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(categoryId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        {/* Отображение списка загруженных изображений через компонент */}
        {eventData.pictures.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {eventData.pictures.map((id, index) => (
              <div key={id} className="relative">
                <ImageByIdComponent
                  id={id}
                  alt={`Загруженное изображение ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <Button
          className="w-full text-black font-semibold py-3 rounded-lg transition duration-200"
          type="submit"
        >
          {loadingCreateEvent ? "Создание..." : "Создать"}
        </Button>
      </form>
    </Card>
  );
};

export default EventCreatePage;
