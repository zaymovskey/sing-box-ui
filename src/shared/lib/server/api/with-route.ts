import type { z } from "zod";

import { readSessionCookie } from "../auth/cookies";
import type { SessionPayload } from "../auth/jwt";
import { verifySession } from "../auth/jwt";
import { errorJson } from "./response-helpers";
import { ServerApiError } from "./server-api-error.class";

type RouteContext = {
  params?: Promise<Record<string, string>> | Record<string, string>;
};

type Handler<
  Auth extends boolean,
  SReq extends z.ZodTypeAny | undefined,
  SRes extends z.ZodTypeAny,
  SParams extends z.ZodTypeAny | undefined,
> = (ctx: {
  request: Request;
  session: Auth extends true ? SessionPayload : undefined;
  body: SReq extends z.ZodTypeAny ? z.output<SReq> : unknown;
  params: SParams extends z.ZodTypeAny
    ? z.output<SParams>
    : Record<string, string>;
}) => Promise<z.output<SRes>>;

type RouteOptions<
  Auth extends boolean,
  SReq extends z.ZodTypeAny | undefined,
  SRes extends z.ZodTypeAny,
  SParams extends z.ZodTypeAny | undefined,
> = {
  auth: Auth;
  requestSchema?: SReq;
  responseSchema: SRes;
  paramsSchema?: SParams;
  handler: Handler<Auth, SReq, SRes, SParams>;
};

export function withRoute<
  const Auth extends boolean,
  const SReq extends z.ZodTypeAny | undefined,
  const SRes extends z.ZodTypeAny,
  const SParams extends z.ZodTypeAny | undefined = undefined,
>(opts: RouteOptions<Auth, SReq, SRes, SParams>) {
  return async (request: Request, context?: RouteContext) => {
    let body: unknown = undefined;

    const method = request.method.toUpperCase();
    const shouldParseBody = method !== "GET" && method !== "HEAD";

    if (shouldParseBody) {
      body = await request.json().catch(() => null);
    }

    if (opts.requestSchema) {
      const parsedReq = opts.requestSchema.safeParse(body);

      if (!parsedReq.success) {
        return errorJson(400, {
          error: {
            message: "Некорректное тело запроса",
            code: "INVALID_REQUEST",
            issues: parsedReq.error.issues.map((issue) => ({
              code: issue.code,
              message: issue.message,
              path: issue.path.join("."),
            })),
          },
        });
      }

      body = parsedReq.data;
    }

    let rawParams: Record<string, string> = {};

    if (context?.params) {
      const resolvedParams = await context.params;
      rawParams = resolvedParams ?? {};
    }

    let params: unknown = rawParams;

    if (opts.paramsSchema) {
      const parsedParams = opts.paramsSchema.safeParse(rawParams);

      if (!parsedParams.success) {
        return errorJson(400, {
          error: {
            message: "Некорректные параметры маршрута",
            code: "INVALID_PARAMS",
            issues: parsedParams.error.issues.map((issue) => ({
              code: issue.code,
              message: issue.message,
              path: issue.path.join("."),
            })),
          },
        });
      }

      params = parsedParams.data;
    }

    try {
      let session: SessionPayload | undefined = undefined;

      if (opts.auth) {
        const token = await readSessionCookie();

        if (!token) {
          return errorJson(401, {
            error: {
              message: "Unauthorized",
              code: "UNAUTHORIZED",
            },
          });
        }

        try {
          session = await verifySession(token);
        } catch {
          return errorJson(401, {
            error: {
              message: "Unauthorized",
              code: "UNAUTHORIZED",
            },
          });
        }
      }

      const data = await opts.handler({
        request,
        session: session as Auth extends true ? SessionPayload : undefined,
        body: body as SReq extends z.ZodTypeAny ? z.output<SReq> : unknown,
        params: params as SParams extends z.ZodTypeAny
          ? z.output<SParams>
          : Record<string, string>,
      });

      const parsedRes = opts.responseSchema.safeParse(data);

      if (!parsedRes.success) {
        throw new ServerApiError(
          500,
          "INVALID_RESPONSE",
          "Некорректный ответ сервера",
          parsedRes.error.issues.map((issue) => ({
            code: issue.code,
            message: issue.message,
            path: issue.path.join("."),
          })),
        );
      }

      return Response.json(parsedRes.data);
    } catch (e) {
      if (e instanceof ServerApiError) {
        return errorJson(e.status, {
          error: {
            code: e.code,
            message: e.message,
            issues: e.issues,
          },
        });
      }

      return errorJson(500, {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unexpected server error",
        },
      });
    }
  };
}
