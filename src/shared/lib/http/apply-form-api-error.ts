import type { FieldValues, UseFormReturn } from "react-hook-form";

import { ApiError } from "./api-error";
import { getErrorMessage } from "./get-error-message";

type StatusMap = Partial<Record<number, string>>;

export function applyFormApiError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  error: unknown,
  map: StatusMap = {},
  fallback = "Ошибка запроса",
) {
  let message = getErrorMessage(error, fallback);

  if (error instanceof ApiError) {
    message = map[error.status] ?? message;
  }

  form.setError("root", { type: "server", message });
}
