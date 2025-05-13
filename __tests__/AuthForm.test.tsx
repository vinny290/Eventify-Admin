import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useLogin } from '../hook/auth/useLogin'
import { AuthForm } from '@/components/custom/AuthForm/AuthForm'

jest.mock('../hook/auth/useLogin.ts')

describe('AuthForm', () => {
  const mockHandleInputChange = jest.fn()
  const mockHandleLogin = jest.fn()

  const setupUseLogin = (overrides = {}) => {
    (useLogin as jest.Mock).mockReturnValue({
      loginData: { email: '', password: '' },
      handleInputChange: mockHandleInputChange,
      handleLogin: mockHandleLogin,
      errorLoginMessage: '',
      isLoading: false,
      ...overrides,
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setupUseLogin()
  })

  it('рендерит поля Email, Пароль и кнопку Вход', () => {
    render(<AuthForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /вход/i })).toBeInTheDocument()
  })

  it('вызывает handleInputChange при вводе в поле Email', () => {
    render(<AuthForm />)
    const emailInput = screen.getByPlaceholderText('example@mail.ru')
    fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
    expect(mockHandleInputChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: emailInput })
    )
  })

  it('дисейблит кнопку и показывает текст Загрузка... при isLoading=true', () => {
    setupUseLogin({ isLoading: true })
    render(<AuthForm />)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveTextContent('Загрузка...')
  })

  it('отображает сообщение об ошибке под полем Пароль, если errorLoginMessage задан', () => {
    setupUseLogin({ errorLoginMessage: 'Тестовая ошибка' })
    render(<AuthForm />)
    expect(screen.getByText('Тестовая ошибка')).toBeInTheDocument()
  })
})
