// components/custom/Slider/Slider.tsx
"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import EventImage from "@/components/custom/EventImage";

interface SliderProps {
  images: Array<string>;
  altTexts?: Array<string>;
}

export function Slider({ images, altTexts }: SliderProps) {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = React.useState(1);

  React.useEffect(() => {
    setCurrent(1);
    if (api) api.scrollTo(0);
  }, [images, api]);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);
    setCurrent(api.selectedScrollSnap() + 1);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!images || images.length === 0) return null;
  const total = images.length;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full h-full rounded-xl">
        {/* Обёртка для тени/рамки: */}
        <div className="w-full h-full ">
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselPrevious className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70">
              ‹
            </CarouselPrevious>
            <CarouselNext className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70">
              ›
            </CarouselNext>
            <CarouselContent className="w-full h-full">
              {images.map((imgId, idx) => (
                <CarouselItem key={idx} className="w-full h-full">
                  <div className="relative w-full h-full">
                    <EventImage
                      imageId={imgId}
                      alt={altTexts?.[idx] || `Фото ${idx + 1}`}
                      height={400}
                      width={400}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Точки навигации поверх контейнера */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="bg-black/30 px-2 py-1 rounded-full flex space-x-2">
            {images.map((_, idx) => {
              const isActive = idx + 1 === current;
              return (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${
                      isActive
                        ? "bg-white scale-110"
                        : "bg-white/60 hover:bg-white"
                    }
                  `}
                  aria-label={`Перейти к слайду ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slider;
