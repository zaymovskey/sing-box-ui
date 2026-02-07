export type ApiIssue = {
  path?: string;
  message: string;
  code?: string;
};

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
    issues?: ApiIssue[];
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isErrorPayload(payload: unknown): payload is ApiErrorPayload {
  if (!isRecord(payload)) return false;

  const error = payload.error;
  if (!isRecord(error)) return false;

  if (typeof error.message !== "string") return false;
  if (typeof error.code !== "string") return false;

  return true;
}
