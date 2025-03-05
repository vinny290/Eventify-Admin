"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocalObservable } from 'mobx-react-lite'
import { AuthStore } from '../stores/AuthStore'

const AuthContext = createContext<AuthStore | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false)
  const authStore = useLocalObservable(() => new AuthStore())

  useEffect(() => {
    authStore.syncFromBrowser()
    setIsHydrated(true)
  }, [authStore])

  return (
    <AuthContext.Provider value={authStore}>
      {isHydrated ? children : null}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const store = useContext(AuthContext)
  if (!store) {
    throw new Error('useAuth должен использоваться внутри AuthProvider')
  }
  return store
}