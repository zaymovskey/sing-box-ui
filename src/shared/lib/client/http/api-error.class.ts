import { z } from "zod";

const ApiIssueSchema = z.object({
  path: z.string().optional(),
  message: z.string(),
  code: z.string().optional(),
});

const ApiErrorPayloadSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    issues: z.array(ApiIssueSchema).optional(),
  }),
});

type ApiErrorPayload = z.infer<typeof ApiErrorPayloadSchema>;
type ApiIssue = z.infer<typeof ApiIssueSchema>;

type ParsedContract = { ok: true; data: ApiErrorPayload } | { ok: false };

export class ApiError extends Error {
  readonly status: number;
  readonly payload?: unknown;

  private readonly _contract: ParsedContract;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;

    const parsed = ApiErrorPayloadSchema.safeParse(payload);
    this._contract = parsed.success
      ? { ok: true, data: parsed.data }
      : { ok: false };
  }

  get isContract(): boolean {
    return this._contract.ok;
  }

  get contract(): ApiErrorPayload | null {
    return this._contract.ok ? this._contract.data : null;
  }

  get code(): string | null {
    return this._contract.ok ? this._contract.data.error.code : null;
  }

  get issues(): ApiIssue[] | null {
    if (!this._contract.ok) return null;
    return this._contract.data.error.issues ?? null;
  }

  get uiMessage(): string {
    if (!this._contract.ok) return this.message;
    return this._contract.data.error.message;
  }
}
