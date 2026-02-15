"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Input } from "../../input";
import { FormItem, FormLabel } from "../form";

type NumberFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
};

export function UncontrolledNumberField<T extends FieldValues>({
  name,
  label,
  placeholder,
}: NumberFieldProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const message: string = errors[name]?.message?.toString() ?? "";

  return (
    <FormItem className="gap-2">
      <FormLabel>{label}</FormLabel>
      <Input
        placeholder={placeholder}
        type="number"
        {...register(name, { valueAsNumber: true })}
      />
      <div className="text-destructive min-h-5 text-sm">{message ?? ""}</div>
    </FormItem>
  );
}
