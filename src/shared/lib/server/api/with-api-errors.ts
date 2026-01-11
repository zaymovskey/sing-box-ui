import { errorJson } from "./response-helpers";

type Handler<Args extends unknown[]> = (...args: Args) => Promise<Response>;

export function withApiErrors<Args extends unknown[]>(
  handler: Handler<Args>,
): Handler<Args> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return errorJson(500, { message, code: "INTERNAL_ERROR" });
    }
  };
}
