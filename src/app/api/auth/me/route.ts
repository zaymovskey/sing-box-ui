import { NextResponse } from "next/server";

import { withSession } from "@/shared/lib/server";

export const GET = withSession(async ({ session }) => {
  return NextResponse.json({
    id: session.sub,
    email: session.email,
    role: session.role,
  });
});
