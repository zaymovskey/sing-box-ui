import { z } from "zod";

export const RealityKeysPairResponseSchema = z.object({
  privateKey: z.string().min(1),
  publicKey: z.string().min(1),
});

export type RealityKeysPairResponse = z.infer<
  typeof RealityKeysPairResponseSchema
>;
