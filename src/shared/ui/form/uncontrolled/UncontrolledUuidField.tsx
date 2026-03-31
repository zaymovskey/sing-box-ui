"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";
import { get } from "react-hook-form";

import { InputWithGenerate } from "../../InputWithGenerate";
import { FormItem, FormLabel } from "../form";

export function UncontrolledInputWithGenerateField<T extends FieldValues>({
  name,
  label,
  placeholder,
  generateFunction,
}: {
  name: Path<T>;
  label: string;
  placeholder?: string;
  generateFunction: () => string;
}) {
  const form = useFormContext<T>();

  const error = get(form.formState.errors, name);
  const message = error?.message?.toString() ?? "";

  const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, "_");
  const inputId = `field_${safeName}`;
  const messageId = `${inputId}_message`;

  return (
    <FormItem className="gap-2">
      <FormLabel>{label}</FormLabel>
      <InputWithGenerate
        aria-describedby={message ? messageId : undefined}
        aria-invalid={!!error}
        id={inputId}
        {...form.register(name)}
        generateFunction={generateFunction}
        placeholder={placeholder}
      />
      <div className="text-destructive min-h-5 text-sm" id={messageId}>
        {message}
      </div>
    </FormItem>
  );
}
