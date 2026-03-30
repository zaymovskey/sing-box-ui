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
  _tlsChecked: z.boolean().optional(),
  _is_selfsigned_cert: z.boolean().optional(),
});

const TlsFormSchema = SecurityAssetMetaFormSchema.extend({
  type: z.literal("tls"),
  name: z.string().min(1, "Name is required"),
  serverName: z.string().optional(),
  _tlsOverwrite: z.boolean().optional(),
  source: z.discriminatedUnion("sourceType", [
    TlsInlineSourceFormSchema,
    TlsFileSourceFormSchema,
  ]),
}).superRefine((data, ctx) => {
  if (data.source.sourceType === "file" && data.source._tlsChecked !== true) {
    ctx.addIssue({
      code: "custom",
      path: ["source", "_tlsChecked"],
      message: "Сначала проверьте сертификат и ключ",
    });
  }
});

const RealityFormSchema = SecurityAssetMetaFormSchema.extend({
  type: z.literal("reality"),
  name: z.string().min(1, "Name is required"),
  serverName: z.string().min(1, "Server name is required"),
  privateKey: z.string().min(1, "Private key is required"),
  _publicKey: z.string().min(1, "Public key is required"),
});

export const SecurityAssetFormSchema = z.discriminatedUnion("type", [
  TlsFormSchema,
  RealityFormSchema,
]);

export type SecurityAssetFormValues = z.infer<typeof SecurityAssetFormSchema>;
