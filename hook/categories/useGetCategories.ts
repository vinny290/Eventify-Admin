"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Category } from '@/types/Category'

const useGetCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingGetListCategories, setLoadingGetListCategories] = useState<boolean>(true)
  const [errorGetListCategories, setErrorGetListCategories] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>('/api/categories/list-categories')
        setCategories(response.data)
        setErrorGetListCategories(null)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setErrorGetListCategories('Unauthorized: Invalid or expired token.')
          } else {
            setErrorGetListCategories('Ошибка при загрузке категорий')
          }
        } else {
            setErrorGetListCategories('Неизвестная ошибка')
        }
        console.error('Error fetching categories:', err)
      } finally {
        setLoadingGetListCategories(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loadingGetListCategories, errorGetListCategories }
}


export default useGetCategories
