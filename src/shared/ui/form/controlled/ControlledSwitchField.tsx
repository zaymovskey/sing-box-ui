"use client";

import { useEffect } from "react";
import {
  type FieldValues,
  type Path,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { Switch } from "../../switch";
import { FormItem, FormLabel } from "../form";

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
  const form = useFormContext<T>();
  const error = form.getFieldState(name, form.formState).error;
  const checked = useWatch({
    control: form.control,
    name,
  });

  useEffect(() => {
    form.register(name);
  }, [form, name]);

  return (
    <FormItem className="flex items-center justify-between rounded-md border p-3">
      <div className="space-y-1">
        <FormLabel className={error ? "text-destructive" : undefined}>
          {label}
        </FormLabel>
        <div className="text-muted-foreground text-xs">{placeholder}</div>
      </div>

      <Switch
        checked={Boolean(checked)}
        disabled={disabled}
        onCheckedChange={(value) => {
          form.clearErrors("root");
          form.setValue(name, value as T[Path<T>], {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: form.formState.submitCount > 0,
          });
        }}
      />
    </FormItem>
  );
}
