import { ApiError } from "./api-error";
import { readErrorMessage } from "./read-error-message";

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

/**
 * Fetch wrapper:
 * - credentials: include (httpOnly cookie)
 * - единая обработка ошибок -> ApiError(status, message, payload)
 * - JSON по умолчанию (если есть тело)
 */
export async function apiFetch<T = unknown>(
  input: string,
  init?: ApiFetchOptions,
): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const { message, payload } = await readErrorMessage(res);
    throw new ApiError(res.status, message, payload);
  }

  // 204 No Content / пустое тело
  if (res.status === 204) return undefined as T;

  // иногда бек может вернуть пустоту даже при 200
  const text = await res.text();
  if (!text) return undefined as T;

  // пробуем JSON, если не JSON — вернём как строку
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
