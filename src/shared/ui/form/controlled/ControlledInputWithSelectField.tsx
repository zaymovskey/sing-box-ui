"use client";

import {
  type FieldValues,
  type Path,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { InputWithSelect } from "../../InputWithSelect";
import { type SelectFieldItem } from "../../select";
import { FormControl, FormField, FormItem, FormLabel } from "../form";

type InputWithSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  selectOptions: SelectFieldItem[];
};

function parseDuration(value: string) {
  const match = value.match(/^(\d+)(ms|s|m|h)$/);

  if (!match) {
    return { inputValue: "", selectValue: "ms" };
  }

  return {
    inputValue: match[1],
    selectValue: match[2],
  };
}

export function ControlledInputWithSelectField<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  selectOptions,
}: InputWithSelectProps<T>) {
  const form = useFormContext<T>();
  const error = form.getFieldState(name, form.formState).error;

  const formValue = useWatch({
    control: form.control,
    name,
  });

  const { inputValue, selectValue } = parseDuration(String(formValue ?? ""));

  const onInputChange = (value: string) => {
    form.setValue(name, `${value}${selectValue}` as never, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSelectChange = (value: string) => {
    const nextValue = inputValue ? `${inputValue}${value}` : "";
    form.setValue(name, nextValue as never, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="space-y-2">
          <FormLabel className={error ? "text-destructive" : undefined}>
            {label}
          </FormLabel>

          <FormControl>
            <InputWithSelect
              inputDisabled={disabled}
              inputValue={inputValue}
              selectDisabled={disabled}
              selectOptions={selectOptions}
              selectValue={selectValue}
              onInputChange={onInputChange}
              onSelectChange={onSelectChange}
            />
          </FormControl>

          <div className="min-h-5">
            {error ? (
              <p className="text-destructive text-sm">
                {String(error.message ?? "")}
              </p>
            ) : placeholder ? (
              <p className="text-muted-foreground text-xs">{placeholder}</p>
            ) : null}
          </div>
        </FormItem>
      )}
    />
  );
}
