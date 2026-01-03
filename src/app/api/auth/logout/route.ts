import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/shared/lib/server";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
