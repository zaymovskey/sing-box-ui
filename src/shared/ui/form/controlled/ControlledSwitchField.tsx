"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Switch } from "../../switch";
import { FormControl, FormField, FormItem, FormLabel } from "../form";

type SwitchFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
};

export function ControlledSwitchField<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
}: SwitchFieldProps<T>) {
  const form = useFormContext();
  const error = form.getFieldState(name, form.formState).error;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-md border p-3">
          <div className="space-y-1">
            <FormLabel className={error ? "text-destructive" : undefined}>
              {label}
            </FormLabel>
            <div className="text-muted-foreground text-xs">{placeholder}</div>
          </div>
          <FormControl>
            <Switch
              checked={Boolean(field.value)}
              disabled={disabled}
              onCheckedChange={(v) => {
                form.clearErrors("root");
                field.onChange(v);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
