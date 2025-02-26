"use client"
import React, { createContext, useContext, useEffect } from 'react'
import { useLocalObservable, observer } from 'mobx-react-lite'
import { AuthStore } from '../stores/AuthStore'

const AuthContext = createContext<AuthStore | null>(null)

export const AuthProvider = observer(({ children }: { children: React.ReactNode }) => {
  const authStore = useLocalObservable(() => new AuthStore())

  useEffect(() => {
    return () => {
      if (authStore.refreshTimer) {
        clearTimeout(authStore.refreshTimer)
        authStore.refreshTimer = null
      }
    }
  }, [authStore])

  return <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
})

export const useAuth = () => {
  const store = useContext(AuthContext)
  if (!store) {
    throw new Error('useAuth должен использоваться внутри AuthProvider')
  }
  return store
}
