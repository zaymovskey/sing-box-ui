import { ApiError } from "./api-error";
import { readErrorMessage } from "./read-error-message";

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

type ResponseMode = "auto" | "text" | "json";

/**
 * Fetch wrapper:
 * - credentials: include (httpOnly cookie)
 * - единая обработка ошибок -> ApiError(status, message, payload)
 * - JSON по умолчанию (если есть тело)
 */
export async function apiFetch<T = unknown>(
  input: string,
  init?: ApiFetchOptions & { responseMode?: ResponseMode },
): Promise<T> {
  const { responseMode = "json", ...rest } = init ?? {};

  const res = await fetch(input, {
    credentials: "include",
    ...rest,
    headers: {
      Accept:
        responseMode === "json"
          ? "application/json"
          : "text/plain, application/json",
      ...(rest?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const { message, payload } = await readErrorMessage(res);
    throw new ApiError(res.status, message, payload);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;

  if (responseMode === "text") return text as T;
  if (responseMode === "json") return JSON.parse(text) as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}
