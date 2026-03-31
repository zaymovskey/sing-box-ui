"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Input } from "../../input";
import { FormItem, FormLabel } from "../form";

type InputProps = React.ComponentProps<typeof Input>;

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  path: string;
  className?: string;
} & Omit<
  InputProps,
  "name" | "id" | "aria-invalid" | "aria-describedby" | "className"
>;

export function UncontrolledPathField<T extends FieldValues>({
  name,
  label,
  type = "text",
  path,
  className,
  ...inputProps
}: Props<T>) {
  const form = useFormContext<T>();
  const error = form.getFieldState(name, form.formState).error;
  const message = error?.message?.toString() ?? "";

  const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, "_");
  const inputId = `field_${safeName}`;
  const messageId = `${inputId}_message`;

  return (
    <FormItem className={className ?? "gap-2"}>
      <FormLabel
        className={error ? "text-destructive" : undefined}
        htmlFor={inputId}
      >
        {label}
      </FormLabel>

      <div className="flex">
        <span className="border-input bg-background text-muted-foreground flex h-9 items-center rounded-md border border-r px-3 py-1 text-base whitespace-nowrap md:text-sm">
          {path}
        </span>

        <Input
          {...form.register(name)}
          {...inputProps}
          aria-describedby={message ? messageId : undefined}
          aria-invalid={!!error}
          id={inputId}
          type={type}
        />
      </div>

      <div className="text-destructive min-h-5 text-sm" id={messageId}>
        {message}
      </div>
    </FormItem>
  );
}
