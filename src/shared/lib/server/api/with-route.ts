import type { z } from "zod";

import { readSessionCookie } from "../auth/cookies";
import type { SessionPayload } from "../auth/jwt";
import { verifySession } from "../auth/jwt";
import { errorJson, okJson } from "./response-helpers";
import { ServerApiError } from "./server-api-error.class";

type Handler<
  Auth extends boolean,
  SReq extends z.ZodTypeAny | undefined,
  SRes extends z.ZodTypeAny,
> = (ctx: {
  request: Request;
  session: Auth extends true ? SessionPayload : undefined;
  body: SReq extends z.ZodTypeAny ? z.output<SReq> : undefined;
}) => Promise<z.output<SRes>>;

type RouteOptions<
  Auth extends boolean,
  SReq extends z.ZodTypeAny | undefined,
  SRes extends z.ZodTypeAny,
> = {
  auth: Auth;
  responseSchema: SRes;
  requestSchema?: SReq;
  handler: Handler<Auth, SReq, SRes>;
};

export function withRoute<
  const Auth extends boolean,
  const SReq extends z.ZodTypeAny | undefined,
  const SRes extends z.ZodTypeAny,
>(opts: RouteOptions<Auth, SReq, SRes>) {
  return async (request: Request) => {
    let body: unknown = undefined;

    if (opts.requestSchema) {
      body = await request.json().catch(() => null);
      const parsedReq = opts.requestSchema.safeParse(body);

      if (!parsedReq.success) {
        return errorJson(400, {
          error: {
            message: "Некорректное тело запроса",
            code: "INVALID_REQUEST",
            issues: parsedReq.error.issues.map((i) => ({
              code: i.code,
              message: i.message,
              path: i.path.join("."),
            })),
          },
        });
      }

      body = parsedReq.data;
    }

    try {
      let session: SessionPayload | undefined;

      if (opts.auth) {
        const token = await readSessionCookie();
        if (!token) {
          return errorJson(401, {
            error: { message: "Unauthorized", code: "UNAUTHORIZED" },
          });
        }

        try {
          session = await verifySession(token);
        } catch {
          return errorJson(401, {
            error: { message: "Unauthorized", code: "UNAUTHORIZED" },
          });
        }
      }

      const data = await opts.handler({
        request,
        session: session as Auth extends true ? SessionPayload : undefined,
        body: body as SReq extends z.ZodTypeAny ? z.output<SReq> : undefined,
      });

      const parsed = opts.responseSchema.parse(data);
      return okJson(parsed);
    } catch (e) {
      if (e instanceof ServerApiError) {
        return errorJson(e.status, {
          error: { code: e.code, message: e.message, issues: e.issues },
        });
      }

      return errorJson(500, {
        error: { code: "INTERNAL_ERROR", message: "Unexpected server error" },
      });
    }
  };
}
