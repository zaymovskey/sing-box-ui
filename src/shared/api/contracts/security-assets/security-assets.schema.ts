import { z } from "zod";

const SecurityAssetBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const TlsInlineSourceSchema = z.object({
  sourceType: z.literal("inline"),
  certificatePem: z.string().min(1),
  keyPem: z.string().min(1),
  _is_selfsigned_cert: z.boolean().optional(),
});

const TlsFileSourceSchema = z.object({
  sourceType: z.literal("file"),
  certificatePath: z.string().min(1),
  keyPath: z.string().min(1),
  _is_selfsigned_cert: z.boolean().optional(),
});

export const TlsSecurityAssetSchema = SecurityAssetBaseSchema.extend({
  type: z.literal("tls"),
  serverName: z.string().min(1).optional(),
  source: z.discriminatedUnion("sourceType", [
    TlsInlineSourceSchema,
    TlsFileSourceSchema,
  ]),
});

export const RealitySecurityAssetSchema = SecurityAssetBaseSchema.extend({
  type: z.literal("reality"),
  serverName: z.string().min(1),
  privateKey: z.string().min(1),
  shortId: z.string().min(1),
  fingerprint: z.string().min(1),
  spiderX: z.string().optional(),
  _publicKey: z.string().min(1),
});

export const SecurityAssetSchema = z.discriminatedUnion("type", [
  TlsSecurityAssetSchema,
  RealitySecurityAssetSchema,
]);

export const SecurityAssetTypeSchema = z.enum(["tls", "reality"]);
export type SecurityAssetType = z.infer<typeof SecurityAssetTypeSchema>;

export const SecurityAssetsSchema = z.array(SecurityAssetSchema);

export type TlsSecurityAsset = z.infer<typeof TlsSecurityAssetSchema>;
export type RealitySecurityAsset = z.infer<typeof RealitySecurityAssetSchema>;
export type SecurityAsset = z.infer<typeof SecurityAssetSchema>;
export type SecurityAssets = z.infer<typeof SecurityAssetsSchema>;
