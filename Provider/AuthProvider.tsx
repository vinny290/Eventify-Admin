"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocalObservable } from 'mobx-react-lite'
import { AuthStore } from '../stores/AuthStore'
import axios from 'axios'

const AuthContext = createContext<AuthStore | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false)
  const authStore = useLocalObservable(() => new AuthStore())

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const success = await authStore.handleRefresh();
          if (success) {
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [authStore]);

  useEffect(() => {
    authStore.syncFromBrowser()
    setIsHydrated(true)
  }, [authStore])

  useEffect(() => {
    const syncCookies = () => authStore.syncFromBrowser();
    window.addEventListener('focus', syncCookies);
    return () => window.removeEventListener('focus', syncCookies);
  }, [authStore]);

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