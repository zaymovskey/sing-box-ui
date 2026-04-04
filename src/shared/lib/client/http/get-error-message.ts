import { ApiError } from "./api-error.class";

export function getErrorMessage(error: unknown, fallback = "Произошла ошибка") {
  if (error instanceof ApiError) return error.message || fallback;
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}
