import z from "zod";

export const ApiIssueSchema = z.object({
  path: z.string().optional(),
  message: z.string(),
  code: z.string().optional(),
});

export const ApiErrorPayloadSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    issues: z.array(ApiIssueSchema).optional(),
  }),
});

export type ApiErrorPayload = z.infer<typeof ApiErrorPayloadSchema>;
export type ApiIssue = z.infer<typeof ApiIssueSchema>;
