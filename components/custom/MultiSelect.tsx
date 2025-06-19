"use client";

import { useState, useRef, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
  color: string; // ожидаем строку вида "#A3C7FF"
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[]; // массив id категорий
  setSelectedValues: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  setSelectedValues,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Для быстрого доступа по id: { [value]: Option }
  const optionMap = useMemo(() => {
    const map: Record<string, Option> = {};
    options.forEach((opt) => {
      map[opt.value] = opt;
    });
    return map;
  }, [options]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const toggleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const removeSelected = (value: string) => {
    setSelectedValues(selectedValues.filter((item) => item !== value));
  };

  const listRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  // Обработчик колесика мыши: предотвращаем всплытие к странице
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  // Обработчики для touch-событий (свайп)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!listRef.current) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartY.current - touchY;
    touchStartY.current = touchY;
    listRef.current.scrollTop += diff;
    e.preventDefault();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          className="flex justify-between px-2 pb-2 items-center h-full min-w-[200px]"
          variant="outline"
        >
          <div className="flex gap-1 flex-wrap">
            {selectedValues.length > 0 ? (
              selectedValues.map((val) => {
                const opt = optionMap[val];
                const bgColor = opt?.color || "#E0E0E0";
                return (
                  <Badge
                    key={val}
                    style={{
                      backgroundColor: bgColor,
                      color: "#000",
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md"
                  >
                    {opt?.label || val}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelected(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          removeSelected(val);
                        }
                      }}
                      className="ml-1 hover:opacity-80 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                );
              })
            ) : (
              <span className="text-gray-500">
                {placeholder || "Select options..."}
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Поиск..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList
            ref={listRef}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="max-h-[240px] overflow-y-auto touch-pan-y"
          >
            {filteredOptions.length === 0 ? (
              <CommandEmpty>Категории не найдены</CommandEmpty>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const bgColor = option.color;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleSelection(option.value)}
                  >
                    <div className="flex items-center w-full">
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          color: bgColor,
                        }}
                      />
                      <span
                        className={
                          isSelected
                            ? "text-black"
                            : "dark:text-white text-black"
                        }
                        style={{
                          backgroundColor: isSelected ? bgColor : "transparent",
                          borderRadius: isSelected ? "0.25rem" : undefined,
                          padding: isSelected ? "0.1rem 0.25rem" : undefined,
                        }}
                      >
                        {option.label}
                      </span>
                    </div>
                  </CommandItem>
                );
              })
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
