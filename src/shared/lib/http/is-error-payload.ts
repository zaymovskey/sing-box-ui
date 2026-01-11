export type ErrorPayload = {
  message: string;
  code?: string;
  details?: unknown;
};

// Если функция вернула true, то внутри этого блока value имеет тип { message: string }
export function isErrorPayload(value: unknown): value is ErrorPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as Record<string, unknown>).message === "string"
  );
}
