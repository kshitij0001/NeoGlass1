import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  category?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onCreateNew?: (query: string) => void;
  createNewLabel?: string;
  disabled?: boolean;
  className?: string;
  allowCreate?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  onCreateNew,
  createNewLabel = "Create new",
  disabled = false,
  className,
  allowCreate = true,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (option.category && option.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedOption = options.find((option) => option.value === value);
  const hasExactMatch = filteredOptions.some(option => 
    option.label.toLowerCase() === searchQuery.toLowerCase()
  );

  const handleCreateNew = () => {
    if (onCreateNew && searchQuery.trim()) {
      onCreateNew(searchQuery.trim());
      setSearchQuery("");
      setOpen(false);
    }
  };

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === value) {
      onValueChange("");
    } else {
      onValueChange(selectedValue);
    }
    setOpen(false);
    setSearchQuery("");
  };

  // Group options by category
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const category = option.category || "Options";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {} as Record<string, ComboboxOption[]>);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between border-3 border-brutal-black dark:border-white bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm font-bold",
            className
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 glass-morphism border-2 border-brutal-black dark:border-white bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
        <Command>
          <div className="flex items-center border-b px-3">
            <Input
              ref={inputRef}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none"
            />
          </div>
          <CommandList className="max-h-60 overflow-y-auto">
            {Object.keys(groupedOptions).length > 0 ? (
              Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                <CommandGroup key={category} heading={category}>
                  {categoryOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="font-bold hover:bg-white/50 dark:hover:bg-gray-700/50"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            ) : (
              <CommandEmpty className="py-6 text-center text-sm">
                {emptyMessage}
              </CommandEmpty>
            )}
            
            {allowCreate && onCreateNew && searchQuery.trim() && !hasExactMatch && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreateNew}
                  className="font-bold hover:bg-white/50 dark:hover:bg-gray-700/50 text-electric-blue"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {createNewLabel}: "{searchQuery}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}