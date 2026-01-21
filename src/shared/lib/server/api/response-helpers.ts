import { type ErrorPayload } from "../../http/is-error-payload";

type InitNoStatus = Omit<ResponseInit, "status">;

const DEFAULT_NO_STORE = "no-store";

// Нормализуем заголовки: объединяем init.headers + наши дефолты
function buildHeaders(init?: InitNoStatus, defaults?: HeadersInit): Headers {
  const h = new Headers(init?.headers);

  if (defaults) {
    const d = new Headers(defaults);
    d.forEach((value, key) => {
      // defaults не должны затирать явные init.headers
      if (!h.has(key)) h.set(key, value);
    });
  }

  return h;
}

// На случай, если ты захочешь переопределить no-store
function ensureNoStore(headers: Headers) {
  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", DEFAULT_NO_STORE);
  }
  return headers;
}

export function okJson<T>(data: T, init?: InitNoStatus) {
  const headers = ensureNoStore(
    buildHeaders(init, { "Content-Type": "application/json; charset=utf-8" }),
  );

  return new Response(JSON.stringify(data), {
    status: 200,
    ...init,
    headers,
  });
}

export function errorJson(
  status: number,
  payload: ErrorPayload,
  init?: InitNoStatus,
) {
  const headers = ensureNoStore(
    buildHeaders(init, { "Content-Type": "application/json; charset=utf-8" }),
  );

  return new Response(JSON.stringify(payload), {
    status,
    ...init,
    headers,
  });
}

/**
 * ✅ Plain text (логи, версии, healthcheck, и т.д.)
 */
export function okText(text: string, init?: InitNoStatus) {
  const headers = ensureNoStore(
    buildHeaders(init, { "Content-Type": "text/plain; charset=utf-8" }),
  );

  return new Response(text, {
    status: 200,
    ...init,
    headers,
  });
}

/**
 * ✅ Raw JSON document as text (конфиги, шаблоны).
 * Важно: НЕ JSON.stringify, иначе будет "строка в JSON".
 */
export function okJsonText(jsonText: string, init?: InitNoStatus) {
  const headers = ensureNoStore(
    buildHeaders(init, { "Content-Type": "application/json; charset=utf-8" }),
  );

  return new Response(jsonText, {
    status: 200,
    ...init,
    headers,
  });
}

/**
 * ✅ 204 No Content
 */
export function noContent(init?: InitNoStatus) {
  const headers = ensureNoStore(buildHeaders(init));

  return new Response(null, {
    status: 204,
    ...init,
    headers,
  });
}
