import type { z } from "zod";

export type ServerApiIssue = {
  path?: string;
  message: string;
  code?: string;
};

export class ServerApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public issues?: ServerApiIssue[],
  ) {
    super(message);
  }

  static fromZod(
    status: number,
    code: string,
    message: string,
    error: z.ZodError,
  ) {
    return new ServerApiError(
      status,
      code,
      message,
      error.issues.map((i) => ({
        message: i.message,
        path: i.path.join("."),
        code: i.code,
      })),
    );
  }
}
