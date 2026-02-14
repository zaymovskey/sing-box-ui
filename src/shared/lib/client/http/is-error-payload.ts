import { type ApiErrorPayload } from "../../../api/contracts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isCustomErrorPayload(
  payload: unknown,
): payload is ApiErrorPayload {
  if (!isRecord(payload)) return false;

  const error = payload.error;
  if (!isRecord(error)) return false;

  if (typeof error.message !== "string") return false;
  if (typeof error.code !== "string") return false;

  return true;
}
