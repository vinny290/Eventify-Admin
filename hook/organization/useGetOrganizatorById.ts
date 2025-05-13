"use client"

import { Organizator } from "@/types/Organizator"
import { useEffect, useState } from "react"
import axios from 'axios'

const useGetOrganizatorById = (id: string) => {
    const [organizator, setOrganizator] = useState<Organizator | null>(null)
    const [image, setImage] = useState()
    const [loadingGetOrganizatorById, setLoadingGetOrganizatorById] = useState<boolean>(true)
    const [errorGetOrganizatorById, setErrorGetOrganizatorById] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrganizator = async () => {
            if (!id) {
                setErrorGetOrganizatorById('Не указан ID события')
                setLoadingGetOrganizatorById(false)
                return
            }

            try {
                const response = await axios.get<Organizator>(`/api/organizations/readOrganization/${id}`)
                setOrganizator(response.data)
                setErrorGetOrganizatorById(null)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        setErrorGetOrganizatorById('Unauthorized: Недействительный или просроченный токен')
                    } else if (err.response?.status === 404) {
                        setErrorGetOrganizatorById('Организатор не найден')
                    } else {
                        setErrorGetOrganizatorById('Неизвестная ошибка')
                    }
                    console.error('Error fetching event:', err)
                } else {
                    setErrorGetOrganizatorById('Неизвестная ошибка')
                }
            } finally {
                setLoadingGetOrganizatorById(false)
            }
        }

        fetchOrganizator()
    }, [id])

    return { organizator, loadingGetOrganizatorById, errorGetOrganizatorById }
}

export default useGetOrganizatorById