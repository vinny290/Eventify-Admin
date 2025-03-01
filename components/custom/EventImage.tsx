// components/EventImage.tsx
import { useImageById } from "@/hook/files/useImageById";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface EventImageProps {
  imageId: string | null | undefined;
  alt?: string;
}

const EventImage: React.FC<EventImageProps> = ({ imageId, alt }) => {
  const { imageUrl, isLoading, error } = useImageById(imageId);

  if (isLoading) {
    return <Skeleton className="w-full h-[200px] rounded-md" />;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (!imageUrl) {
    return <div className="text-gray-400 text-sm">Изображение отсутствует</div>;
  }

  return (
    <div className="relative w-full h-[200px]">
      <Image
        src={imageUrl}
        alt={alt || "Изображение события"}
        fill
        className="object-cover rounded-t-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default EventImage;
