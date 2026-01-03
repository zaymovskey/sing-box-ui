import "server-only";

import { cookies } from "next/headers";

export function getAuthCookieName() {
  return process.env.AUTH_COOKIE_NAME ?? "sbui_session";
}

/**
 * Ставит cookie с JWT.
 */
export async function setSessionCookie(token: string) {
  const name = getAuthCookieName();
  const jar = await cookies();

  jar.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Читает JWT из cookie.
 */
export async function readSessionCookie(): Promise<string | null> {
  const name = getAuthCookieName();
  const jar = await cookies();

  return jar.get(name)?.value ?? null;
}

/**
 * Logout: удаляем cookie.
 */
export async function clearSessionCookie() {
  const name = getAuthCookieName();
  const jar = await cookies();

  jar.set(name, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}
