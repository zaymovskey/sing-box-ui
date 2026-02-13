import { ApiErrorPayloadSchema } from "./api-error.schema";

export async function readErrorMessage(res: Response): Promise<{
  message: string;
  payload?: unknown;
}> {
  const fallback = `Ошибка ${res.status}`;

  // 1) Пробуем JSON
  try {
    const payload = (await res.clone().json()) as unknown;

    const parsed = ApiErrorPayloadSchema.safeParse(payload);
    if (parsed.success) {
      return { message: parsed.data.error.message, payload };
    }

    // JSON есть, но не наш формат — вернём payload (может пригодиться для логов)
    return { message: fallback, payload };
  } catch {
    // не JSON — идём дальше
  }

  // 2) Пробуем текст
  try {
    const text = (await res.text()).trim();
    if (text) return { message: text };
  } catch {
    // игнор
  }

  // 3) Фоллбек
  return { message: fallback };
}
