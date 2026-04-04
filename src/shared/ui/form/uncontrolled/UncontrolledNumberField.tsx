"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Input } from "../../input";
import { FormItem, FormLabel } from "../form";

type InputProps = React.ComponentProps<typeof Input>;

type NumberFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
} & Omit<InputProps, "name" | "id" | "aria-invalid" | "aria-describedby">;

export function UncontrolledNumberField<T extends FieldValues>({
  name,
  label,
  ...inputProps
}: NumberFieldProps<T>) {
  const { register } = useFormContext<T>();

  const form = useFormContext<T>();
  const error = form.getFieldState(name, form.formState).error;
  const message = error?.message?.toString() ?? "";

  const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, "_");
  const inputId = `field_${safeName}`;
  const messageId = `${inputId}_message`;

  return (
    <FormItem className="gap-2">
      <FormLabel className={error ? "text-destructive" : undefined}>
        {label}
      </FormLabel>
      <Input
        {...inputProps}
        type="number"
        {...register(name, { valueAsNumber: true })}
        aria-describedby={message ? messageId : undefined}
        aria-invalid={!!error}
        id={inputId}
      />
      <div className="text-destructive min-h-5 text-sm">{message ?? ""}</div>
    </FormItem>
  );
}
