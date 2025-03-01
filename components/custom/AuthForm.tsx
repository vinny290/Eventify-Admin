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
        <h1 className="text-4xl font-bold">Вход в аккаунт</h1>
        <p className="text-balance text-base text-muted-foreground">
          Введите свой Email и Пароль для входа
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@mail.ru"
            value={loginData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Пароль</Label>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            required
          />
          {errorLoginMessage && (
            <p className="text-red-500 text-sm">{errorLoginMessage}</p>
          )}
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