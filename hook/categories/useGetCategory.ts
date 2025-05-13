"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Category } from '@/types/Category'

const useGetCategories = (ids: string[]) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!ids || ids.length === 0) {
        setCategories([])
        setLoading(false)
        return
      }

      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await axios.get<Category>(`/api/categories/${id}`)
            return res.data
          })
        )
        setCategories(results)
        setError(null)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError('Ошибка при загрузке категорий')
        } else {
          setError('Неизвестная ошибка')
        }
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [JSON.stringify(ids)])

  return { categories, loading, error }
}

export default useGetCategories