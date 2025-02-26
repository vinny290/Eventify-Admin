/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/Provider/AuthProvider'

export function useLogin() {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [errorLoginMessage, setErrorLoginMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const authStore = useAuth();
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginData(prev => ({ 
        ...prev, 
        [e.target.name]: e.target.value 
      }));
      setErrorLoginMessage(null);
    };
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const response = await axios.post('/api/auth/login', loginData);
        authStore.login(response.data.accessToken, response.data.refreshToken, response.data.userID);
        router.push('/');
      } catch (error: any) {
        console.error('Login error:', error);
        setErrorLoginMessage(
          error.response?.data?.message || 
          "Неверный email или пароль"
        );
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
  
    return {
      loginData,
      handleInputChange,
      handleLogin,
      errorLoginMessage,
      isLoading
    };
}