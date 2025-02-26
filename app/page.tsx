"use client"
import { Button } from '@/components/ui/button'
import { useAuth } from '@/Provider/AuthProvider'

export default function Home() {
  const authStore = useAuth()
  return (
   <div className='flex justify-center items-center min-h-screen'>
    Home Page
      {authStore.accessToken ? (
            <Button className="text-black">
              Выход
            </Button>
          ) : (
            <Button className="text-black">
              Войти
            </Button>
          )}
   </div>
  );
}
