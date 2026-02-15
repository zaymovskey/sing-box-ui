"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { UuidInput } from "../../uuid-input";
import { FormItem, FormLabel } from "../form";

export function UncontrolledUuidField<T extends FieldValues>({
  name,
  label,
  placeholder,
}: {
  name: Path<T>;
  label: string;
  placeholder?: string;
}) {
  const form = useFormContext<T>();

  const message: string =
    form.formState.errors[name]?.message?.toString() ?? "";
  return (
    <FormItem className="gap-2">
      <FormLabel>{label}</FormLabel>
      <UuidInput {...form.register(name)} placeholder={placeholder} />
      <div className="min-h-5">{message}</div>
    </FormItem>
  );
}
