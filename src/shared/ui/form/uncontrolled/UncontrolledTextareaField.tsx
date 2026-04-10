"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Textarea } from "../../textarea";
import { FormItem, FormLabel } from "../form";

type TextareaProps = React.ComponentProps<typeof Textarea>;

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  showErrorMessage?: boolean;
} & Omit<TextareaProps, "name" | "id" | "aria-invalid" | "aria-describedby">;

export function UncontrolledTextareaField<T extends FieldValues>({
  name,
  label,
  showErrorMessage = true,
  ...inputProps
}: Props<T>) {
  const form = useFormContext<T>();
  const error = form.getFieldState(name, form.formState).error;
  const message = error?.message?.toString() ?? "";

  const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, "_");
  const inputId = `field_${safeName}`;
  const messageId = `${inputId}_message`;

  return (
    <FormItem className="gap-2">
      {label && (
        <FormLabel
          className={error ? "text-destructive" : undefined}
          htmlFor={inputId}
        >
          {label}
        </FormLabel>
      )}

      <Textarea
        {...form.register(name)}
        {...inputProps}
        aria-describedby={message ? messageId : undefined}
        aria-invalid={!!error}
        id={inputId}
      />

      {showErrorMessage && (
        <div className="text-destructive min-h-5 text-sm" id={messageId}>
          {message}
        </div>
      )}
    </FormItem>
  );
}
