import { z } from "zod";

export const VlessTlsGenerateResponseSchema = z.object({
  privateKey: z.string().min(1),
  publicKey: z.string().min(1),
});

export type VlessTlsGenerateResponse = z.infer<
  typeof VlessTlsGenerateResponseSchema
>;
