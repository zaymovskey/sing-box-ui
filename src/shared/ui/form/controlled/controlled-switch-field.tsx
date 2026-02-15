"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Switch } from "../../switch";
import { FormControl, FormField, FormItem, FormLabel } from "../form";

type SwitchFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
};

export function ControlledSwitchField<T extends FieldValues>({
  name,
  label,
  placeholder,
}: SwitchFieldProps<T>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-md border p-3">
          <div className="space-y-1">
            <FormLabel className="m-0">{label}</FormLabel>
            <div className="text-muted-foreground text-xs">{placeholder}</div>
          </div>
          <FormControl>
            <Switch
              checked={Boolean(field.value)}
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
