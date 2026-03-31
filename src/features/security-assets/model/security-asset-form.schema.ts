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

const BaseTlsFormSchema = SecurityAssetMetaFormSchema.extend({
  type: z.literal("tls"),
  name: z.string().min(1, "Name is required"),
  serverName: z.string().optional(),
  _tlsOverwrite: z.boolean().optional(),
  source: z.discriminatedUnion("sourceType", [
    TlsInlineSourceFormSchema,
    TlsFileSourceFormSchema,
  ]),
});

const BaseRealityFormSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1).optional(),
  type: z.literal("reality"),
  name: z.string().min(1, "Name is required"),
  serverName: z.string().min(1, "Server name is required"),
  privateKey: z.string().min(1, "Private key is required"),
  shortId: z
    .string()
    .min(1, "Short ID is required")
    .max(16, "Short ID must be <= 16 characters")
    .transform((v) => v.trim().toLowerCase())
    .refine((v) => /^[0-9a-f]+$/.test(v), {
      message: "Short ID must be hex (0-9, a-f)",
    }),
  fingerprint: z.string().min(1, "Fingerprint is required"),
  spiderX: z.string().optional(),
  _publicKey: z.string().min(1, "Public key is required"),
});

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function addDuplicateNameIssue(
  name: string,
  existingNames: string[],
  ctx: z.RefinementCtx,
  currentName?: string,
) {
  const normalizedCurrentName = normalizeName(name);
  const normalizedOriginalName = currentName
    ? normalizeName(currentName)
    : undefined;

  const hasDuplicate = existingNames.some((existingName) => {
    const normalizedExistingName = normalizeName(existingName);

    if (
      normalizedOriginalName &&
      normalizedExistingName === normalizedOriginalName
    ) {
      return false;
    }

    return normalizedExistingName === normalizedCurrentName;
  });

  if (hasDuplicate) {
    ctx.addIssue({
      code: "custom",
      path: ["name"],
      message: "Ассет с таким name уже существует",
    });
  }
}

export function createTlsFormSchema(
  existingNames: string[],
  currentName?: string,
) {
  return BaseTlsFormSchema.superRefine((data, ctx) => {
    if (data.source.sourceType === "file" && data.source._tlsChecked !== true) {
      ctx.addIssue({
        code: "custom",
        path: ["source", "_tlsChecked"],
        message: "Сначала проверьте сертификат и ключ",
      });
    }

    addDuplicateNameIssue(data.name, existingNames, ctx, currentName);
  });
}

export function createRealityFormSchema(
  existingNames: string[],
  currentName?: string,
) {
  return BaseRealityFormSchema.superRefine((data, ctx) => {
    addDuplicateNameIssue(data.name, existingNames, ctx, currentName);
  });
}

export const SecurityAssetFormSchemaBase = z.discriminatedUnion("type", [
  BaseTlsFormSchema,
  BaseRealityFormSchema,
]);

export type SecurityAssetFormValues = z.infer<
  typeof SecurityAssetFormSchemaBase
>;

export function createSecurityAssetFormSchema(
  existingNames: string[],
  currentName?: string,
) {
  return z.discriminatedUnion("type", [
    createTlsFormSchema(existingNames, currentName),
    createRealityFormSchema(existingNames, currentName),
  ]);
}
