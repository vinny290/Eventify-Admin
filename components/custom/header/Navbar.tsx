"use client"
import { Button } from '@/components/ui/button'
import { observer } from 'mobx-react-lite'
import { useAuth } from '@/Provider/AuthProvider'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Navbar = observer(() => {
  const auth = useAuth()
  const router = useRouter()
  
  
  const handleClickLogout = async () => {
    try {
      await auth.logout()
      router.push('/')
      toast.success('Успешный выход!')
    } catch (error: any) {
      toast.error(error.response?.data?.message ||
        "Проблема выхода из аккаунта")
    }
  }

  return (
    <nav className="w-full bg-white/[0.02] dark:bg-white/[0.02] backdrop-blur-xl border-b border-gray-200 dark:border-white/5 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image 
              src="/images/header/logo-light.svg" 
              width={8} 
              height={8} 
              alt="Eventify" 
              className="w-8 h-8" 
            />
            <div className="text-xl font-medium bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
              Eventify
            </div>
          </div>
        </Link>
        
        {auth.accessToken && (
          <Link href="/event/create">
            <p>Создание</p>
          </Link>
        )}

        <div className="flex items-center gap-6">
          <a
            href="#contact"
            className="text-gray-600 dark:text-white/60 hover:text-primary-light dark:hover:text-white transition-colors duration-200"
          >
            Контакты
          </a>
          
          {auth.accessToken ? (
            <Button 
              className="text-black" 
              onClick={handleClickLogout}
              disabled={auth.isRefreshing}
            >
              Выход
            </Button>
          ) : (
            <Link href="/auth">
              <Button className="text-black">
                Войти
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
})

export default Navbar