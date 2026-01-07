import { NextResponse } from "next/server";

import { readSessionCookie } from "./cookies";
import { type SessionPayload, verifySession } from "./jwt";

type HandlerCtx = {
  session: SessionPayload;
  request: Request;
};

type AuthedHandler = (ctx: HandlerCtx) => Promise<Response>;

export function withSession(handler: AuthedHandler) {
  return async (request: Request): Promise<Response> => {
    const token = await readSessionCookie();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const session = await verifySession(token);
      return handler({ request, session });
    } catch {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  };
}
