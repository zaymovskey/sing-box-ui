"use client";

import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/client/cn";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type MultiSelectOption = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
};

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Выберите значения",
  emptyText = "Ничего не найдено",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = React.useMemo(() => {
    const selectedSet = new Set(value);

    return options.filter((option) => selectedSet.has(option.value));
  }, [options, value]);

  const handleToggle = React.useCallback(
    (optionValue: string) => {
      const nextValue = value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue];

      onValueChange(nextValue);
    },
    [onValueChange, value],
  );

  const handleClear = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onValueChange([]);
    },
    [onValueChange],
  );

  const triggerLabel = React.useMemo(() => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (selectedOptions.length <= 2) {
      return selectedOptions.map((option) => option.label).join(", ");
    }

    return `Выбрано: ${selectedOptions.length}`;
  }, [placeholder, selectedOptions]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "w-fit justify-between gap-2 font-normal",
            !selectedOptions.length && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
          role="combobox"
          type="button"
          variant="outline"
        >
          <span className="truncate text-left">{triggerLabel}</span>

          <div className="flex items-center gap-1">
            {selectedOptions.length > 0 && (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <span
                className="text-muted-foreground hover:text-foreground"
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear(e as React.MouseEvent<HTMLButtonElement>);
                }}
              >
                <X className="size-4" />
              </span>
            )}

            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[260px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    className="cursor-pointer"
                    onSelect={() => handleToggle(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        {value.length > 0 && (
          <div className="border-t p-2">
            <Button
              className="w-full"
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => onValueChange([])}
            >
              Сбросить
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
