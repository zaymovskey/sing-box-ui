import { NextResponse } from "next/server";

import { setSessionCookie, signSession } from "@/shared/lib/server";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as LoginBody | null;

  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  const demoEmail = process.env.AUTH_DEMO_EMAIL ?? "admin@example.com";
  const demoPassword = process.env.AUTH_DEMO_PASSWORD ?? "admin12345";

  if (email !== demoEmail || password !== demoPassword) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const token = await signSession({
    sub: "1",
    email,
    role: "admin",
  });

  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
