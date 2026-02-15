import { type ApiErrorPayload } from "../../../api/contracts";

type InitNoStatus = Omit<ResponseInit, "status">;

const DEFAULT_NO_STORE = "no-store";

function buildHeaders(init?: InitNoStatus, defaults?: HeadersInit): Headers {
  const headers = new Headers(init?.headers);

  if (defaults) {
    const d = new Headers(defaults);
    d.forEach((value, key) => {
      if (!headers.has(key)) headers.set(key, value);
    });
  }

  return headers;
}

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
  payload: ApiErrorPayload,
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

export function noContent(init?: InitNoStatus) {
  const headers = ensureNoStore(buildHeaders(init));

  return new Response(null, {
    status: 204,
    ...init,
    headers,
  });
}
