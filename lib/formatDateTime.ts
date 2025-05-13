import { format } from 'date-fns'

export const formatDateTime = (timestamp: number) => {
    return format(new Date(timestamp), 'dd.MM.yyyy HH:mm');
  };