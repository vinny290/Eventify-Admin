/* eslint-disable @typescript-eslint/no-explicit-any */
// useLogout.tsx
"use client"
import { useAuth } from '@/Provider/AuthProvider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useLogout() {
    const [isLoading, setIsLoading] = useState(false)
    const [errorLogoutMessage, setErrorLogoutMessage] = useState<string | null>(null)
    const router = useRouter()
    const authStore = useAuth()

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            authStore.logout()
            router.push('/')
        } catch (error: any) {
            console.error('Logout error:', error)
            setErrorLogoutMessage(
                error.response?.data?.message ||
                "Проблема выхода из аккаунта"
            )
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return {
        handleLogout,
        errorLogoutMessage,
        isLoading
    }
}