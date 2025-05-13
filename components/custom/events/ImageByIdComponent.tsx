import { useImageById } from '@/hook/files/useImageById'
import React from "react";

interface ImageByIdProps {
  id: string;
  alt?: string;
  className?: string;
}

const ImageByIdComponent: React.FC<ImageByIdProps> = ({ id, alt, className }) => {
  const { imageUrl, isLoading, error } = useImageById(id);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки изображения</p>;
  if (!imageUrl) return null;

  return <img src={imageUrl} alt={alt} className={className} />;
};

export default ImageByIdComponent;
