import { z } from "zod";

const SecurityAssetMetaFormSchema = z.object({
  id: z.string().min(1),
  createdAt: z.iso.datetime(),
});

const TlsInlineSourceFormSchema = z.object({
  sourceType: z.literal("inline"),
  certificatePem: z.string().min(1, "Certificate is required"),
  keyPem: z.string().min(1, "Key is required"),
});

const TlsFileSourceFormSchema = z.object({
  sourceType: z.literal("file"),
  certificatePath: z.string().min(1, "Certificate path is required"),
  keyPath: z.string().min(1, "Key path is required"),
});

const TlsFormSchema = SecurityAssetMetaFormSchema.extend({
  type: z.literal("tls"),
  name: z.string().min(1, "Name is required"),
  serverName: z.string().optional(),
  source: z.discriminatedUnion("sourceType", [
    TlsInlineSourceFormSchema,
    TlsFileSourceFormSchema,
  ]),
});

const RealityFormSchema = SecurityAssetMetaFormSchema.extend({
  type: z.literal("reality"),
  name: z.string().min(1, "Name is required"),
  serverName: z.string().min(1, "Server name is required"),
  privateKey: z.string().min(1, "Private key is required"),
  shortId: z.string().min(1, "Short ID is required"),
  publicKey: z.string().optional(),
});

export const SecurityAssetFormSchema = z.discriminatedUnion("type", [
  TlsFormSchema,
  RealityFormSchema,
]);

export type SecurityAssetFormValues = z.infer<typeof SecurityAssetFormSchema>;
