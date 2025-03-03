// src/hook/files/useUploadProfileImage.ts
import { useState } from 'react';
import axios from 'axios';

export const useUploadProfileImage = () => {
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState<string | null>(null);

  const uploadImage = async ({ file }: { file: File }): Promise<string> => {
    setLoadingUpload(true);
    setErrorUpload(null);

    const formData = new FormData();
    formData.append('file', file); // Передаём один файл

    try {
        const response = await axios.post<{ id: string }>( // Ожидаем объект с id
          '/api/file/upload',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
    
        // Возвращаем id из ответа
        return response.data.id;
      } catch (err) {
      let errorMessage = 'Ошибка загрузки изображения';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      setErrorUpload(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoadingUpload(false);
    }
  };

  return { uploadImage, loadingUpload, errorUpload };
};
