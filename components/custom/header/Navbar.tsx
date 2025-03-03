"use client"
import { Button } from '@/components/ui/button'
import { useAuth } from '@/Provider/AuthProvider'
import { observer } from 'mobx-react-lite'
import { useLogout } from '@/hook/auth/useLogout'
import { toast } from 'sonner'

import Image from 'next/image'
import Link from 'next/link'

const Navbar = observer(() => {
  const authStore = useAuth()
  const {
    handleLogout,
    errorLogoutMessage,
    isLoading
  } = useLogout()

  const handleClickLogout = async () => {
    try {
      await handleLogout()
      toast.success('Успешный выход!')
    } catch {
      toast.error(errorLogoutMessage || 'Ошибка при выходе')
    }
  }
  return (
    <nav className="w-full bg-white/[0.02] dark:bg-white/[0.02] backdrop-blur-xl border-b border-gray-200 dark:border-white/5 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/images/header/logo-light.svg" width={8} height={8} alt="Eventify" className="w-8 h-8" />
            <div className="text-xl font-medium bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
              Eventify
            </div>
          </div>
        </Link>
        <Link href="/event/create">
          <p>Создание</p>
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#contact"
            className="text-gray-600 dark:text-white/60 hover:text-primary-light dark:hover:text-white transition-colors duration-200"
          >
            Контакты
          </a>
          {authStore.accessToken ? (
            <Button className="text-black" onClick={handleClickLogout} disabled={isLoading}>
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