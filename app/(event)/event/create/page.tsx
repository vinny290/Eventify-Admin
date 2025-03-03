"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useGetCategories from '@/hook/events/useGetCategories'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUploadProfileImage } from '@/hook/files/useUpload'
import { useCreateEvent } from '@/hook/events/useCreateEvent'
import ImageByIdComponent from '@/components/custom/events/ImageByIdComponent'
import { useRouter } from 'next/navigation'

const EventCreatePage = () => {
    const router = useRouter()
    const [eventData, setEventData] = useState({
        title: '',
        cover: '',
        pictures: [] as string[],
        description: '',
        start: '',
        end: '',
        location: '',
        categories: [] as string[],
        organizationID: "708dee71-9744-4167-b82b-d337381b79c8"
    })

    const { categories, loadingGetListCategories, errorGetListCategories } = useGetCategories()
    const { uploadImage, loadingUpload, errorUpload } = useUploadProfileImage()
    const { createEvent, loadingCreateEvent, errorCreateEvent } = useCreateEvent()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEventData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleCategoryChange = (value: string) => {
        if (!eventData.categories.includes(value)) {
            setEventData(prevState => ({
                ...prevState,
                categories: [...prevState.categories, value]
            }))
        }
    }

    const handleRemoveCategory = (categoryId: string) => {
        setEventData(prevState => ({
            ...prevState,
            categories: prevState.categories.filter(id => id !== categoryId)
        }))
    }

    const handleRemoveImage = (index: number) => {
        setEventData(prevState => ({
            ...prevState,
            pictures: prevState.pictures.filter((_, i) => i !== index)
        }))
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const filesArray = Array.from(files).slice(0, 5 - eventData.pictures.length)

        try {
            const results = await Promise.all(
                filesArray.map(file => uploadImage({ file }))
            )

            // results содержит id загруженных изображений
            const newIds = results.flat()

            setEventData(prev => ({
                ...prev,
                cover: prev.cover || newIds[0] || "",
                pictures: [...prev.pictures, ...newIds].slice(0, 5)
            }))

        } catch (err) {
            console.error("Ошибка загрузки:", err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const createdEvent = await createEvent({
                ...eventData,
                start: new Date(eventData.start).getTime() / 1000,
                end: new Date(eventData.end).getTime() / 1000
            })
            console.log('Созданный ивент:', createdEvent)
            router.push('/')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Card className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Создание ивента</h1>
            <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="title" className="text-gray-700 font-medium">Название</Label>
                    <Input
                        type="text"
                        name="title"
                        placeholder="Введите название ивента"
                        value={eventData.title}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="cover" className="text-gray-700 font-medium">Обложка</Label>
                    <Input
                        id="cover"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept="image/*"
                    />
                    {loadingUpload && <p>Загрузка изображения...</p>}
                    {errorUpload && <p className="text-red-500">{errorUpload}</p>}
                    
                    {/* Отображение обложки через компонент */}
                    {eventData.cover && (
                        <div className="mt-2">
                            <ImageByIdComponent 
                                id={eventData.cover} 
                                alt="Загруженная обложка" 
                                className="w-32 h-32 object-cover rounded-lg" 
                            />
                        </div>
                    )}
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="description" className="text-gray-700 font-medium">Описание</Label>
                    <Textarea
                        name="description"
                        placeholder="Введите описание ивента"
                        value={eventData.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="start" className="text-gray-700 font-medium">Начало</Label>
                    <Input
                        type="datetime-local"
                        name="start"
                        value={eventData.start}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="end" className="text-gray-700 font-medium">Конец</Label>
                    <Input
                        type="datetime-local"
                        name="end"
                        value={eventData.end}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="location" className="text-gray-700 font-medium">Место проведения</Label>
                    <Input
                        type="text"
                        name="location"
                        placeholder="Введите место проведения"
                        value={eventData.location}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="categories" className="text-gray-700 font-medium">Категории</Label>
                    {loadingGetListCategories ? (
                        <p>Загрузка категорий...</p>
                    ) : errorGetListCategories ? (
                        <p className="text-red-500">{errorGetListCategories}</p>
                    ) : (
                        <>
                            <Select
                                value=""
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                                    const category = categories.find(c => c.id === categoryId)
                                    return (
                                        <div
                                            key={categoryId}
                                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
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
                                    )
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
                   {loadingCreateEvent ? 'Создание...' : 'Создать'}
                </Button>
            </form>
        </Card>
    )
}

export default EventCreatePage
