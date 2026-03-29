"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

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
  errorMessage?: boolean;
};

export function ControlledSelectField<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  items,
  errorMessage = true,
}: SelectFieldProps<T>) {
  const form = useFormContext();
  const error = form.getFieldState(name, form.formState).error;
  const message = error?.message?.toString() ?? "";
  const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, "_");
  const inputId = `field_${safeName}`;
  const messageId = `${inputId}_message`;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: typeField }) => (
        <FormItem className="gap-2">
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Select
              disabled={disabled}
              value={typeField.value}
              onValueChange={(v) => {
                form.clearErrors("root");
                typeField.onChange(v);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
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

          {errorMessage && (
            <div className="text-destructive min-h-5 text-sm" id={messageId}>
              {message}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
