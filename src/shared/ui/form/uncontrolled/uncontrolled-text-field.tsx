"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Input } from "../../input";
import { FormItem, FormLabel } from "../form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
};

export function UncontrolledTextField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
}: Props<T>) {
  const form = useFormContext<T>();
  const error = form.getFieldState(name, form.formState).error;
  const message = error?.message?.toString() ?? "";

  const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, "_");
  const inputId = `field_${safeName}`;
  const messageId = `${inputId}_message`;

  return (
    <FormItem className="gap-2">
      <FormLabel htmlFor={inputId}>{label}</FormLabel>

      <Input
        aria-describedby={message ? messageId : undefined}
        aria-invalid={!!error}
        id={inputId}
        placeholder={placeholder}
        type={type}
        {...form.register(name)}
      />

      <div className="text-destructive min-h-5 text-sm" id={messageId}>
        {message}
      </div>
    </FormItem>
  );
}
