"use client";

import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { useAuth } from "@/Provider/AuthProvider";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle";

const Navbar = observer(() => {
  const auth = useAuth();
  const router = useRouter();

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
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo-light.svg"
              width={8}
              height={8}
              alt="Eventify"
              className="w-12 h-12"
            />
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
              Eventify
            </div>
          </div>
        </Link>

        {auth.accessToken && (
          <Link href="/event/create">
            <Button className="bg-backgroundLight hover:bg-backgroundLight dark:bg-backgroundDark dark:text-white">
              Создать событие
            </Button>
          </Link>
        )}

        <div className="flex items-center gap-6">
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
      </div>
    </nav>
  );
});

export default Navbar;
