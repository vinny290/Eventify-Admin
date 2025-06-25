"use client";

import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { useAuth } from "@/Provider/AuthProvider";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRight, LogOut, Menu } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = observer(() => {
  const auth = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const handleClickLogout = async () => {
    try {
      await auth.logout();
      toast.success("Успешный выход!");
      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Проблема выхода из аккаунта"
      );
    }
  };

  return (
    <nav className="w-full bg-white/[0.02] backdrop-blur-xl border-b border-gray-200 dark:border-white/5 z-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex-1 flex justify-start">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                width={50}
                height={50}
                alt="Eventify"
              />
              <div>
                <Image
                  width={150}
                  height={75}
                  src={
                    resolvedTheme === "dark"
                      ? "/images/logo-text.svg"
                      : "/images/logo-text-dark.svg"
                  }
                  alt="logo-text"
                />
              </div>
            </div>
          </Link>
        </div>

        <div className="flex-1 hidden md:flex justify-center">
          {auth.accessToken && (
            <Link href="/event/create">
              <Button className="bg-primary text-white">Создать событие</Button>
            </Link>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/contact"
              className="text-gray-600 dark:text-white/60 hover:text-primary-light dark:hover:text-white transition-colors duration-200"
            >
              Контакты
            </Link>
            <ModeToggle />

            {auth.accessToken ? (
              <Button
                className="text-red-text dark:text-red-text border-red-text dark:border-red-text"
                variant="outline"
                onClick={handleClickLogout}
                disabled={auth.isRefreshing}
              >
                Выйти
              </Button>
            ) : (
              <Link href="/auth">
                <Button className="text-black">Регистрация</Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-4 mt-2">
                {auth.accessToken && (
                  <DropdownMenuItem
                    onClick={() => router.push("/event/create")}
                    className="cursor-pointer"
                  >
                    Создать событие
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => router.push("#contact")}
                  className="cursor-pointer"
                >
                  Контакты
                </DropdownMenuItem>
                {auth.accessToken ? (
                  <DropdownMenuItem
                    onClick={handleClickLogout}
                    disabled={auth.isRefreshing}
                    className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Выход
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => router.push("/auth")}
                    className="cursor-pointer"
                  >
                    <ArrowRight className="h-4 w-4 mr-3" />
                    Войти
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
