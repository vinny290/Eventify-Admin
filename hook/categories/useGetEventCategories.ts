"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Category {
  id: string;
  title: string;
  color: string;
  cover: string;
}

const useGetEventCategories = (categoryIds: string[]) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!categoryIds || categoryIds.length === 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const promises = categoryIds.map(id => 
          axios.get<Category>(`/api/categories/readCategory/${id}`)
            .then(res => res.data)
            .catch(err => {
              console.error(`Error fetching category ${id}:`, err)
              return null
            })
        )

        const results = await Promise.all(promises)
        const validCategories = results.filter(c => c !== null) as Category[]
        
        setCategories(validCategories)
        setError(null)
      } catch (err) {
        setError('Ошибка при загрузке категорий')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [categoryIds])

  return { categories, loading, error }
}

export default useGetEventCategories