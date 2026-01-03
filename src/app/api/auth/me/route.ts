import { NextResponse } from "next/server";

import { readSessionCookie, verifySession } from "@/shared/lib/server";

export async function GET() {
  const token = await readSessionCookie();

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const session = await verifySession(token);

    return NextResponse.json({
      user: {
        id: session.sub,
        email: session.email,
        role: session.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
