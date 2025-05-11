"use client"

import { Organizator } from "@/types/Organizator"
import { useEffect, useState } from "react"
import axios from 'axios'

const useGetOrganizatorById = (id: string) => {
    const [organizator, setOrganizator] = useState<Organizator | null>(null)
    const [loading, setLoadingOrganizatorById] = useState<boolean>(true)
    const [errorOrganizatorById, setErrorOrganizatorById] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrganizator = async () => {
            if (!id) {
                setErrorOrganizatorById('Не указан ID события')
                setLoadingOrganizatorById(false)
                return
            }

            try {
                const response = await axios.get<Organizator>(`/api/organizations/${id}`)
                setOrganizator(response.data)
                setErrorOrganizatorById(null)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        setErrorOrganizatorById('Unauthorized: Недействительный или просроченный токен')
                    } else if (err.response?.status === 404) {
                        setErrorOrganizatorById('Организатор не найден')
                    } else {
                        setErrorOrganizatorById('Неизвестная ошибка')
                    }
                    console.error('Error fetching event:', err)
                } else {
                    setErrorOrganizatorById('Неизвестная ошибка')
                }
            } finally {
                setLoadingOrganizatorById(false)
            }
        }

        fetchOrganizator()
    }, [id])

    return { organizator, loading, errorOrganizatorById }
}

export default useGetOrganizatorById