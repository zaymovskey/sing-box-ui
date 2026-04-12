import { z } from "zod";

// const SecurityAssetMetaFormSchema = z.object({
//   id: z.string().min(1),
//   createdAt: z.iso.datetime(),
//   updatedAt: z.iso.datetime().optional(),
// });

const TlsInlineSourceFormSchema = z.object({
  sourceType: z.literal("inline"),
  certificatePem: z.string().min(1, "Укажите сертификат"),
  keyPem: z.string().min(1, "Укажите ключ"),
});

const TlsFileSourceFormSchema = z.object({
  sourceType: z.literal("file"),
  certificatePath: z.string().min(1, "Укажите путь к сертификату"),
  keyPath: z.string().min(1, "Укажите путь к ключу"),
  _tlsChecked: z.boolean().optional(),
  _is_selfsigned_cert: z.boolean().optional(),
});

const BaseTlsFormSchema = z.object({
  type: z.literal("tls"),
  name: z.string().min(1, "Укажите имя"),
  serverName: z.string().optional(),
  source: z.discriminatedUnion("sourceType", [
    TlsInlineSourceFormSchema,
    TlsFileSourceFormSchema,
  ]),
});

const RealityShortIdSchema = z
  .string()
  .min(1, "Укажите Short ID")
  .max(16, "Short ID должен быть не длиннее 16 символов")
  .transform((v) => v.trim().toLowerCase())
  .refine((v) => /^[0-9a-f]+$/.test(v), {
    message: "Short ID должен содержать только hex-символы: 0-9 и a-f",
  });

const BaseRealityFormSchema = z.object({
  type: z.literal("reality"),
  name: z.string().min(1, "Укажите имя"),
  serverName: z.string().min(1, "Укажите Server Name"),
  privateKey: z.string().min(1, "Укажите приватный ключ"),
  shortId: RealityShortIdSchema,
  fingerprint: z.string().min(1, "Выберите fingerprint"),
  spiderX: z.string().optional(),
  handshakeServer: z.string().min(1, "Укажите handshake server"),
  handshakeServerPort: z
    .number("Порт handshake server должен быть числом")
    .int("Порт handshake server должен быть целым числом")
    .min(1, "Минимальный порт: 1")
    .max(65535, "Максимальный порт: 65535"),
  maxTimeDifference: z.string().optional(),
  _publicKey: z.string().min(1, "Укажите публичный ключ"),
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
      message: "Ассет с таким именем уже существует",
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
        path: ["source"],
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
