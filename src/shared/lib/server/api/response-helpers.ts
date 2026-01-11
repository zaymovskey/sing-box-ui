import { NextResponse } from "next/server";

import type { ErrorPayload } from "../../http/is-error-payload";

export function okJson<T>(data: T, init?: Omit<ResponseInit, "status">) {
  return NextResponse.json(data, {
    status: 200,
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}

export function errorJson(
  status: number,
  payload: ErrorPayload,
  init?: Omit<ResponseInit, "status">,
) {
  return NextResponse.json(payload, {
    status,
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}
