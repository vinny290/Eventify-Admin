"use client"

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"
import * as React from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      {...props}
      // Указываем атрибут class вместо className
      attribute="class"
      // Отключаем переходы при изменении темы
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}