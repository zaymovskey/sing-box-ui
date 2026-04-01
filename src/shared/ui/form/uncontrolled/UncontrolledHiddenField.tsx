import { type FieldValues, type Path, useFormContext } from "react-hook-form";

type HiddenFieldProps<T extends FieldValues> = {
  name: Path<T>;
};

export function UncontrolledHiddenField<T extends FieldValues>({
  name,
}: HiddenFieldProps<T>) {
  const form = useFormContext<T>();

  return <input type="hidden" {...form.register(name)} />;
}
