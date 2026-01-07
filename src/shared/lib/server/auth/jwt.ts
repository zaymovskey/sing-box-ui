import "server-only";

import { jwtVerify, SignJWT } from "jose";

import { serverEnv } from "../env-server";

const encoder = new TextEncoder();

/**
 * Что лежит в JWT payload.
 * sub = user id, email/role нужны для "кто я" и "что можно".
 */
export type SessionPayload = {
  sub: string;
  email: string;
  role: "admin" | "user";
};

/**
 * Берём секрет из env и превращаем в Uint8Array.
 * jose работает с байтами, поэтому TextEncoder.
 */
function getSecretKey() {
  const secret = serverEnv.AUTH_JWT_SECRET;
  if (!secret) throw new Error("AUTH_JWT_SECRET is not set");
  return encoder.encode(secret);
}

/**
 * Создание JWT:
 * - HS256: HMAC SHA-256 (симметричная подпись одним секретом)
 * - iat: автоматически ставим "выпущен тогда-то"
 * - exp: срок жизни (сейчас 7d)
 */
export async function signSession(payload: SessionPayload) {
  const secretKey = getSecretKey();

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // алгоритм подписи
    .setIssuedAt() // iat
    .setExpirationTime("7d") // exp
    .sign(secretKey); // подписываем секретом -> получаем строку JWT
}

/**
 * Проверка JWT:
 * - проверяет подпись (token не подделан)
 * - проверяет exp (не протух)
 * Возвращает payload в строгом виде.
 */
export async function verifySession(token: string): Promise<SessionPayload> {
  const secretKey = getSecretKey();

  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
  });

  /**
   * payload у jose типизирован как "JWTClaims" и поля там unknown.
   * Поэтому делаем ручную мини-валидацию, чтобы не тащить мусор дальше.
   */
  const sub = payload.sub;
  const email = payload.email;
  const role = payload.role;

  if (typeof sub !== "string") throw new Error("Invalid token payload: sub");
  if (typeof email !== "string")
    throw new Error("Invalid token payload: email");
  if (role !== "admin" && role !== "user")
    throw new Error("Invalid token payload: role");

  return { sub, email, role };
}
