import { type ApiErrorPayload, isErrorPayload } from "./is-error-payload";

export async function readErrorMessage(res: Response): Promise<{
  message: string;
  payload?: ApiErrorPayload;
}> {
  let message = `Ошибка ${res.status}`;
  let payload: ApiErrorPayload | undefined = undefined;

  let hasJsonMessage = false;

  try {
    payload = await res.clone().json();
    if (isErrorPayload(payload)) {
      message = payload.error.message;
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
