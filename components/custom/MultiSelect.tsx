import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelectDialog: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  setSelectedValues,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

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

  return (
   <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button
      className="flex justify-between px-2 pb-2 items-center h-full min-w-[280px] sm:min-w-[300px] lg:min-w-[350px] w-full max-w-full"
      variant="outline"
    >
      <div className="flex gap-1 flex-wrap max-w-[80%]">
        {selectedValues.length > 0 ? (
          selectedValues.map((val) => (
            <Badge
              key={val}
              className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded-md"
            >
              {options.find((opt) => opt.value === val)?.label}
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
                className="ml-1 text-red-500 hover:text-red-700 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </div>
            </Badge>
          ))
        ) : (
          <span className="text-gray-500">
            {placeholder || "Select options..."}
          </span>
        )}
      </div>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </DialogTrigger>
  <DialogContent className="w-[90vw] sm:w-[400px] max-h-[80vh] p-4 overflow-hidden">
    <DialogHeader>
      <DialogTitle>Выберите категории</DialogTitle>
      <DialogDescription>Поиск и выбор нескольких категорий</DialogDescription>
    </DialogHeader>
    <div className="p-1">
      <Command>
        <CommandInput
          placeholder="Поиск..."
          value={inputValue}
          onValueChange={setInputValue}
        />
        <CommandList className="max-h-[200px] overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <CommandEmpty>Категории не найдены</CommandEmpty>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleSelection(option.value)}
                >
                  <div className="flex items-center">
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {option.label}
                  </div>
                </CommandItem>
              );
            })
          )}
        </CommandList>
      </Command>
    </div>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Готово</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  );
};

export default MultiSelectDialog;