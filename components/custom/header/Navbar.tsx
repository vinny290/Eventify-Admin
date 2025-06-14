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
  const { theme, resolvedTheme } = useTheme();

  const handleClickLogout = async () => {
    try {
      await auth.logout();
      router.push("/");
      toast.success("Успешный выход!");
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
                src={
                  resolvedTheme === "dark"
                    ? "/images/logo-dark.svg"
                    : "/images/logo-light.svg"
                }
                width={50}
                height={50}
                alt="Eventify"
              />
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Eventify
              </div>
            </div>
          </Link>
        </div>

        <div className="flex-1 hidden md:flex justify-center">
          {auth.accessToken && (
            <Link href="/event/create">
              <Button className="bg-backgroundLight hover:bg-backgroundLight dark:bg-backgroundDark dark:text-white">
                Создать событие
              </Button>
            </Link>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#contact"
              className="text-gray-600 dark:text-white/60 hover:text-primary-light dark:hover:text-white transition-colors duration-200"
            >
              Контакты
            </a>
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
