import { z } from "zod";

const BaseInboundFormSchema = z.object({
  type: z.enum(["vless", "hysteria2"]),
  tag: z.string().trim().min(1, "Tag обязателен"),
  listen_port: z.number().int().min(1).max(65535),
  sniff: z.boolean(),
  sniff_override_destination: z.boolean(),
  listen: z.string().trim(),
});

const VlessUserSchema = z.object({
  name: z.string().trim().min(1, "Нужен user_name"),
  uuid: z.uuid("Нужен UUID"),
  flow: z.string().trim().optional(),
});

const Hy2UserSchema = z.object({
  name: z.string().trim().min(1, "Нужен user_name"),
  password: z.string().trim().min(1, "Нужен password"),
});

const VlessFormSchema = BaseInboundFormSchema.extend({
  type: z.literal("vless"),
  reality_handshake_port: z.number().int().min(1).max(65535),
  tls_server_name: z.string().trim().min(1),
  reality_handshake_server: z.string().trim().min(1),
  reality_private_key: z.string().trim().min(1, "Нужен private_key"),
  users: z.array(VlessUserSchema).min(1, "Нужен хотя бы один пользователь"),
});

const Hy2FormSchema = BaseInboundFormSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: z.number().int().min(1),
  down_mbps: z.number().int().min(1),
  obfs_password: z.string().trim().optional(),
  tls_server_name: z.string().trim().min(1),
  certificate_path: z.string().trim().min(1, "Нужен путь к .crt"),
  key_path: z.string().trim().min(1, "Нужен путь к .key"),
  users: z.array(Hy2UserSchema).min(1, "Нужен хотя бы один пользователь"),
});

export const InboundFormSchema = z.discriminatedUnion("type", [
  VlessFormSchema,
  Hy2FormSchema,
]);

export type InboundFormValues = z.input<typeof InboundFormSchema>;
