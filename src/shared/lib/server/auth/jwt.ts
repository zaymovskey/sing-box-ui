import "server-only";

import { jwtVerify, SignJWT } from "jose";

import { getServerEnv } from "../env-server";

const encoder = new TextEncoder();

export type SessionPayload = {
  sub: string;
  email: string;
  role: "admin" | "user";
};

function getSecretKey() {
  const serverEnv = getServerEnv();
  const secret = serverEnv.AUTH_JWT_SECRET;
  if (!secret) throw new Error("AUTH_JWT_SECRET is not set");
  return encoder.encode(secret);
}

export async function signSession(payload: SessionPayload) {
  const secretKey = getSecretKey();

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // алгоритм подписи
    .setIssuedAt() // iat
    .setExpirationTime("7d") // exp
    .sign(secretKey); // подписываем секретом -> получаем строку JWT
}

export async function verifySession(token: string): Promise<SessionPayload> {
  const secretKey = getSecretKey();

  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
  });

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
