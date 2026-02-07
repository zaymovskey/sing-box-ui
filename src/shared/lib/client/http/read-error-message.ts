import { isErrorPayload } from "./is-error-payload";

export async function readErrorMessage(res: Response): Promise<{
  message: string;
  payload?: unknown;
}> {
  let message = `Ошибка ${res.status}`;
  let payload: unknown = undefined;

  let hasJsonMessage = false;

  try {
    payload = await res.clone().json();
    if (isErrorPayload(payload)) {
      message = payload.message;
      hasJsonMessage = true;
    }
  } catch {
    // not JSON — ok
  }

  if (!hasJsonMessage) {
    try {
      const text = await res.text();
      if (text?.trim()) {
        message = text.trim();
      }
    } catch {
      // ignore
    }
  }

  return { message, payload };
}
