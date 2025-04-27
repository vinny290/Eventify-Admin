import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useGetEvents } from '@/hook/events/useGetListEvents'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import EventsPage from '@/app/page'

// Моки зависимостей
jest.mock('../hook/events/useGetListEvents')
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('../components/custom/EventImage', () => () => (
  <div data-testid="event-image" />
))

describe('EventsPage', () => {
  const pushMock = jest.fn()
  const mockRefetch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  it('показывает Skeleton при загрузке', () => {
    ;(useGetEvents as jest.Mock).mockReturnValue({
      events: null,
      isLoading: true,
      errorGetListEvents: null,
      refetch: mockRefetch,
    })

    render(<EventsPage />)
    // Ожидаем 6 Skeleton-карточек
    const skeletons = screen.getAllByText((_, el) =>
      el?.classList.contains('h-[200px]') ?? false
    )
    expect(skeletons).toHaveLength(6)
  })

  it('показывает ошибку и кнопку повторного запроса при ошибке', () => {
    ;(useGetEvents as jest.Mock).mockReturnValue({
      events: null,
      isLoading: false,
      errorGetListEvents: 'Ошибка сервера',
      refetch: mockRefetch,
    })
    
    render(<EventsPage />)
    expect(screen.getByText('Ошибка сервера')).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /попробовать снова/i })
    fireEvent.click(btn)
    expect(mockRefetch).toHaveBeenCalled()
  })

  it('показывает сообщение, когда нет мероприятий', () => {
    ;(useGetEvents as jest.Mock).mockReturnValue({
      events: [],
      isLoading: false,
      errorGetListEvents: null,
      refetch: mockRefetch,
    })

    render(<EventsPage />)
    expect(screen.getByText('Мероприятий не найдено')).toBeInTheDocument()
  })

  it('рендерит карточки мероприятий и обрабатывает клик', () => {
    const event = {
      id: '1',
      title: 'Тестовое событие',
      start: 1682409600, // 25 апр 2023 00:00 UTC
      cover: 'img1',
      location: 'Москва',
      description: 'Описание события',
    }
    ;(useGetEvents as jest.Mock).mockReturnValue({
      events: [event],
      isLoading: false,
      errorGetListEvents: null,
      refetch: mockRefetch,
    })

    render(<EventsPage />)

    // Проверяем основные поля
    expect(screen.getByText(event.title)).toBeInTheDocument()
    const formattedDate = format(new Date(event.start * 1000), 'd MMMM yyyy', { locale: ru })
    const formattedTime = format(new Date(event.start * 1000), 'HH:mm', { locale: ru })
    expect(screen.getByText(formattedDate)).toBeInTheDocument()
    expect(screen.getByText(formattedTime)).toBeInTheDocument()
    expect(screen.getByText(event.location)).toBeInTheDocument()
    expect(screen.getByText(event.description)).toBeInTheDocument()

    // Клик по карточке вызывает переход
    fireEvent.click(screen.getByText(event.title))
    expect(pushMock).toHaveBeenCalledWith(`/event/${event.id}`)
  })
})
