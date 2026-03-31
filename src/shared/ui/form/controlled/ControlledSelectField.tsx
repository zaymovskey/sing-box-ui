"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { cn } from "../../../lib/client/cn";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../select";
import { FormControl, FormField, FormItem, FormLabel } from "../form";

export type SelectFieldItem = {
  value: string;
  label: string;
};

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  items: SelectFieldItem[];
  showErrorMessage?: boolean;
  loading?: boolean;
};

export function ControlledSelectField<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  items,
  showErrorMessage = true,
  loading = false,
}: SelectFieldProps<T>) {
  const form = useFormContext<T>();
  const error = form.getFieldState(name, form.formState).error;
  const message = error?.message?.toString() ?? "";
  const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, "_");
  const inputId = `field_${safeName}`;
  const messageId = `${inputId}_message`;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-2">
          <FormLabel
            className={error ? "text-destructive" : undefined}
            htmlFor={inputId}
          >
            {label}
          </FormLabel>

          <FormControl>
            <Select
              disabled={disabled}
              value={field.value ?? ""}
              onValueChange={(value) => {
                form.clearErrors("root");
                field.onChange(value);
              }}
            >
              <SelectTrigger
                aria-describedby={message ? messageId : undefined}
                aria-invalid={!!error}
                className={cn(
                  "w-full",
                  error && "border-destructive focus-visible:ring-destructive",
                )}
                disabled={disabled || loading}
                id={inputId}
                loading={loading}
              >
                <SelectValue
                  placeholder={items.length === 0 ? "Нет данных" : placeholder}
                />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>

          {showErrorMessage && (
            <div className="text-destructive min-h-5 text-sm" id={messageId}>
              {message}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
