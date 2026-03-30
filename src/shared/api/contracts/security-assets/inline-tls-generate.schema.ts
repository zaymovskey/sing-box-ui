import { z } from "zod";

export const TLSInlineGenerateResponseSchema = z.object({
  certificatePem: z.string().min(1),
  keyPem: z.string().min(1),
});

export const TLSInlineGenerateRequestSchema = z.object({
  serverName: z.string().min(1),
});

export type TLSInlineGenerateResponse = z.infer<
  typeof TLSInlineGenerateResponseSchema
>;

export type TLSInlineGenerateRequest = z.infer<
  typeof TLSInlineGenerateRequestSchema
>;
