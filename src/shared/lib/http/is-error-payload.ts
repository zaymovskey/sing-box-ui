// Если функция вернула true, то внутри этого блока value имеет тип { message: string }
export function isErrorPayload(value: unknown): value is { message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as Record<string, unknown>).message === "string"
  );
}
