import { z } from "zod";

const BaseInboundFormSchema = z.object({
  type: z.enum(["vless", "hysteria2"]),
  tag: z.string().trim().min(1, "Tag обязателен"),
  listen_port: z.number().int().min(1).max(65535),
  reality_handshake_port: z.number().int().min(1).max(65535),
  sniff: z.boolean().default(true),
  sniff_override_destination: z.boolean().default(true),
});

const VlessFormSchema = BaseInboundFormSchema.extend({
  type: z.literal("vless"),
  user_name: z.string().trim().min(1).default("user"),
  uuid: z.uuid("Нужен UUID"),
  flow: z.string().trim().optional(),

  tls_server_name: z.string().trim().min(1).default("www.cloudflare.com"),
  reality_handshake_server: z
    .string()
    .trim()
    .min(1)
    .default("www.cloudflare.com"),
  reality_handshake_port: z.coerce.number().int().min(1).max(65535),
  reality_private_key: z.string().trim().min(1, "Нужен private_key"),
});

const Hy2FormSchema = BaseInboundFormSchema.extend({
  type: z.literal("hysteria2"),
  user_name: z.string().trim().min(1).default("user"),
  password: z.string().trim().min(1, "Нужен password"),

  up_mbps: z.coerce.number().int().min(1).default(100),
  down_mbps: z.coerce.number().int().min(1).default(100),

  obfs_password: z.string().trim().optional(),

  tls_server_name: z.string().trim().min(1).default("www.cloudflare.com"),
  certificate_path: z.string().trim().min(1, "Нужен путь к .crt"),
  key_path: z.string().trim().min(1, "Нужен путь к .key"),
});

export const CreateInboundFormSchema = z.discriminatedUnion("type", [
  VlessFormSchema,
  Hy2FormSchema,
]);

export type CreateInboundFormValues = z.input<typeof CreateInboundFormSchema>;
