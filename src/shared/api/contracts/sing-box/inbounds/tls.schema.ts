import { z } from "zod";

import {
  SingBoxHysteria2TlsSchema,
  SingBoxVlessRealitySchema,
  SingBoxVlessTlsSchema,
} from "../core/inbounds.schema";

export const StoredVlessRealitySchema = SingBoxVlessRealitySchema.extend({
  _reality_public_key: z.string().optional(),
});

export const StoredVlessTlsSchema = SingBoxVlessTlsSchema.extend({
  reality: StoredVlessRealitySchema.optional(),
});

export const StoredHysteria2TlsSchema = SingBoxHysteria2TlsSchema;

export type StoredVlessReality = z.infer<typeof StoredVlessRealitySchema>;
export type StoredVlessTls = z.infer<typeof StoredVlessTlsSchema>;
export type StoredHysteria2Tls = z.infer<typeof StoredHysteria2TlsSchema>;
