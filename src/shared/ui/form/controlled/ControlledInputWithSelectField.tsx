"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type FieldValues,
  type Path,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { InputWithSelect } from "../../InputWithSelect";
import { FormControl, FormField, FormItem, FormLabel } from "../form";

export type SelectFieldItem<T extends string> = {
  value: T;
  label: string;
};

type ParsedInputWithSelectValue<SelectValue extends string> = {
  inputValue: string;
  selectValue: SelectValue;
};

type InputWithSelectProps<
  TFormValues extends FieldValues,
  SelectValue extends string,
> = {
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  selectOptions: SelectFieldItem<SelectValue>[];
  defaultSelectValue: SelectValue;
  parseValue: (
    rawValue: string,
    defaultSelectValue: SelectValue,
  ) => ParsedInputWithSelectValue<SelectValue>;
  formatValue: (
    inputValue: string,
    selectValue: SelectValue,
  ) => string | undefined;
};

export function ControlledInputWithSelectField<
  TFormValues extends FieldValues,
  SelectValue extends string,
>({
  name,
  label,
  placeholder,
  disabled = false,
  selectOptions,
  defaultSelectValue,
  parseValue,
  formatValue,
}: InputWithSelectProps<TFormValues, SelectValue>) {
  const form = useFormContext<TFormValues>();
  const error = form.getFieldState(name, form.formState).error;

  const formValue = useWatch({
    control: form.control,
    name,
  });

  const parsed = useMemo(
    () => parseValue(String(formValue ?? ""), defaultSelectValue),
    [defaultSelectValue, formValue, parseValue],
  );

  const [selectedValue, setSelectedValue] = useState<SelectValue>(
    parsed.selectValue,
  );

  useEffect(() => {
    if (parsed.inputValue) {
      setSelectedValue(parsed.selectValue);
    }
  }, [parsed.inputValue, parsed.selectValue]);

  const onInputChange = (value: string) => {
    const nextValue = formatValue(value.trim(), selectedValue);

    form.setValue(name, nextValue as never, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSelectChange = (value: SelectValue) => {
    setSelectedValue(value);

    const nextValue = formatValue(parsed.inputValue.trim(), value);

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
              inputValue={parsed.inputValue}
              selectDisabled={disabled}
              selectOptions={selectOptions}
              selectValue={selectedValue}
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
