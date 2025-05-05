"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hook/auth/useLogin";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export function AuthForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    loginData,
    handleInputChange,
    handleLogin,
    errorLoginMessage,
    isLoading,
  } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin(e);
      toast.success("Успешный вход!");
    } catch {
      toast.error(errorLoginMessage || "Ошибка авторизации");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">Вход</h1>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@mail.ru"
            value={loginData.email}
            onChange={handleInputChange}
            required
            className="input text-foreground"
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-foreground">
              Пароль
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="*******"
            value={loginData.password}
            onChange={handleInputChange}
            required
            className="input text-foreground"
          />
          {errorLoginMessage && (
            <p className="text-destructive text-sm">{errorLoginMessage}</p>
          )}

          <div className="flex justify-between items-center">
            <Link
              href="#resetpassword"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Не помню пароль
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Войти"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Еще нет аккаунта?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Регистрация
          </Link>
        </div>
      </div>
    </form>
  );
}
