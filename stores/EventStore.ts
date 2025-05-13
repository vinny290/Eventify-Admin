// Определяем интерфейс для события
interface IEvent {
  title?: string;
  description?: string;
  start?: number; // время в миллисекундах
  end?: number;   // время в миллисекундах
  location?: string;
  cover?: string;
  categories?: string[];
}

import { makeAutoObservable } from "mobx";

export class EventStore {
  // Исходное событие
  originalEvent: IEvent | null = null;
  // Редактируемое событие; Partial<IEvent> позволяет иметь не все поля
  editedEvent: Partial<IEvent> = {};

  constructor() {
    makeAutoObservable(this);
  }

  // Инициализация данных мероприятия
  setEvent(event: IEvent) {
    this.originalEvent = event;
    // Копируем данные для редактирования
    this.editedEvent = { ...event };
  }

  // Обновление конкретного поля
  updateField(field: keyof IEvent, value: any) {
    this.editedEvent[field] = value;
  }

  // Вычисляемое свойство, возвращающее изменённые поля
  get changedFields() {
    const changes: Partial<IEvent> = {};
    if (!this.originalEvent) return changes;

    if (this.editedEvent.title !== this.originalEvent.title) {
      changes.title = this.editedEvent.title;
    }
    if (this.editedEvent.description !== this.originalEvent.description) {
      changes.description = this.editedEvent.description;
    }
    const originalStartSeconds = Math.floor((this.originalEvent.start ?? 0) / 1000);
    const editedStartSeconds = Math.floor((this.editedEvent.start ?? 0) / 1000);
    if (editedStartSeconds !== originalStartSeconds) {
      changes.start = editedStartSeconds;
    }
  
    const originalEndSeconds = Math.floor((this.originalEvent.end ?? 0) / 1000);
    const editedEndSeconds = Math.floor((this.editedEvent.end ?? 0) / 1000);
    if (editedEndSeconds !== originalEndSeconds) {
      changes.end = editedEndSeconds;
    }
    
    if (this.editedEvent.location !== this.originalEvent.location) {
      changes.location = this.editedEvent.location;
    }
    if (this.editedEvent.cover !== this.originalEvent.cover) {
      changes.cover = this.editedEvent.cover;
    }
    if (JSON.stringify(this.editedEvent.categories) !== JSON.stringify(this.originalEvent.categories)) {
      changes.categories = this.editedEvent.categories;
    }

    return changes;
  }
}

const eventStore = new EventStore();
export default eventStore;
