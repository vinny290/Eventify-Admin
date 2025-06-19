// components/EventImage.tsx
import { useImageById } from "@/hook/files/useImageById";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EventImageProps {
  imageId: string | null | undefined;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  fill?: boolean;
}

const EventImage: React.FC<EventImageProps> = ({
  imageId,
  alt,
  width,
  height,
  className,
  fill = false,
}) => {
  const { imageUrl, isLoading, error } = useImageById(imageId);

  if (isLoading) {
    return (
      <Skeleton
        className={cn("rounded-md", className)}
        style={{
          width: width || "100%",
          height: height || "200px",
        }}
      />
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (!imageUrl) {
    return <div className="text-gray-400 text-sm">Изображение отсутствует</div>;
  }
  console.log("slider Image Url: ", imageUrl);

  // Парсим размеры для числовых значений
  const parsedWidth = typeof width === "string" ? parseInt(width) : width;
  const parsedHeight = typeof height === "string" ? parseInt(height) : height;

  return (
    <div
      className={cn("relative", className, { "w-full h-full": fill })}
      style={
        fill
          ? {}
          : {
              width: width || "100%",
              height: height || "200px",
            }
      }
    >
      <Image
        loader={() => imageUrl}
        src={imageUrl}
        alt={alt || "Изображение события"}
        fill={fill}
        width={!fill ? parsedWidth : undefined}
        height={!fill ? parsedHeight : undefined}
        className={cn("object-cover rounded-t-lg", { static: !fill })}
        sizes={
          fill
            ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            : undefined
        }
      />
    </div>
  );
};

export default EventImage;
