// AuthForm.tsx
"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from '@/hook/auth/useLogin'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function AuthForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    loginData,
    handleInputChange,
    handleLogin,
    errorLoginMessage,
    isLoading
  } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await handleLogin(e)
      toast.success('Успешный вход!')
    } catch {
      toast.error(errorLoginMessage || 'Ошибка авторизации')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6 ", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Вход</h1>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2 text-gray-600">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@mail.ru"
            value={loginData.email}
            onChange={handleInputChange}
            required
            className="bg-gray-100 border-0"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center text-gray-600">
            <Label htmlFor="password">Пароль</Label>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            required
            className="bg-gray-100 border-0"
          />
          {errorLoginMessage && (
            <p className="text-red-500 text-sm">{errorLoginMessage}</p>
          )}
          
          <div className="flex items-center gap-6">
          <a
            href="#resetpassword"
            className="hover:underline dark:text-white/60 hover:text-primary-light dark:hover:text-white transition-colors duration-200"
          >
            Не помню пароль
          </a>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full text-black"
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Вход'}
        </Button>

      </div>
    </form>
  )
}