export const localToUTC = (localTime: string): string => {
    const date = new Date(localTime); 
    return date.toISOString(); // Возвращает, например, "2023-03-15T10:00:00.000Z"
  };