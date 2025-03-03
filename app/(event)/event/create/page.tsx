"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useGetCategories from '@/hook/events/useGetCategories'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const EventCreatePage = () => {
    const [eventData, setEventData] = useState({
        title: '',
        cover: '',
        pictures: [],
        description: '',
        start: '',
        end: '',
        location: '',
        categories: [] as string[], // Массив для хранения выбранных категорий
        organizationID: ''
    })

    const { categories, loadingGetListCategories, errorGetListCategories } = useGetCategories()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEventData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleCategoryChange = (value: string) => {
        // Добавляем выбранную категорию в массив, если её ещё нет
        if (!eventData.categories.includes(value)) {
            setEventData(prevState => ({
                ...prevState,
                categories: [...prevState.categories, value]
            }))
        }
    }

    const handleRemoveCategory = (categoryId: string) => {
        // Удаляем категорию из массива
        setEventData(prevState => ({
            ...prevState,
            categories: prevState.categories.filter(id => id !== categoryId)
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Здесь можно добавить логику для отправки данных на сервер
        console.log('Event Data:', eventData)
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
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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

                            {/* Отображение выбранных категорий */}
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

                <Button
                    className="w-full text-black font-semibold py-3 rounded-lg transition duration-200"
                    type="submit"
                >
                    Создать
                </Button>
            </form>
        </Card>
    )
}

export default EventCreatePage