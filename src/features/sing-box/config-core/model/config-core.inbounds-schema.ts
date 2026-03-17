import { z } from "zod";

import { hasExtension } from "../lib/hy2/hy2-tls-path.utils";

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

  tls_enabled: z.boolean(),
  reality_enabled: z.boolean(),

  tls_server_name: z.string().trim().optional(),
  reality_handshake_server: z.string().trim().optional(),
  reality_handshake_server_port: z.number().int().min(1).max(65535).optional(),
  reality_private_key: z.string().trim().optional(),

  users: z.array(VlessUserSchema).min(1, "Нужен хотя бы один пользователь"),
}).superRefine((data, ctx) => {
  if (data.tls_enabled) {
    if (!data.tls_server_name) {
      ctx.addIssue({
        code: "custom",
        path: ["tls_server_name"],
        message: "Нужен TLS server name",
      });
    }
  }

  if (data.reality_enabled) {
    if (!data.tls_enabled) {
      ctx.addIssue({
        code: "custom",
        path: ["reality_enabled"],
        message: "Reality требует включенного TLS",
      });
    }

    if (!data.reality_handshake_server) {
      ctx.addIssue({
        code: "custom",
        path: ["reality_handshake_server"],
        message: "Нужен handshake server",
      });
    }

    if (data.reality_handshake_server_port == null) {
      ctx.addIssue({
        code: "custom",
        path: ["reality_handshake_server_port"],
        message: "Нужен handshake server port",
      });
    }

    if (!data.reality_private_key) {
      ctx.addIssue({
        code: "custom",
        path: ["reality_private_key"],
        message: "Нужен private_key",
      });
    }
  }
});

const Hy2FormSchema = BaseInboundFormSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: z.number().int().min(1),
  down_mbps: z.number().int().min(1),
  obfs_password: z.string().trim().optional(),
  users: z.array(Hy2UserSchema).min(1, "Нужен хотя бы один пользователь"),
  tls_enabled: z.boolean(),
  tls_server_name: z.string().trim().optional(),
  key_path: z.string().trim().optional(),
  certificate_path: z.string().trim().optional(),
  _tlsChecked: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.tls_enabled) {
    if (!data.tls_server_name) {
      ctx.addIssue({
        code: "custom",
        path: ["tls_server_name"],
        message: "Нужен TLS server name",
      });
    }

    if (!data.certificate_path) {
      ctx.addIssue({
        code: "custom",
        path: ["certificate_path"],
        message: "Нужен путь к .crt",
      });
    } else {
      if (!hasExtension(data.certificate_path, ".crt")) {
        ctx.addIssue({
          code: "custom",
          path: ["certificate_path"],
          message: "Файл сертификата должен иметь расширение .crt",
        });
      }
    }

    if (!data.key_path) {
      ctx.addIssue({
        code: "custom",
        path: ["key_path"],
        message: "Нужен путь к .key",
      });
    } else {
      if (!hasExtension(data.key_path, ".key")) {
        ctx.addIssue({
          code: "custom",
          path: ["key_path"],
          message: "Файл ключа должен иметь расширение .key",
        });
      }
    }

    if (data._tlsChecked !== true) {
      ctx.addIssue({
        code: "custom",
        path: ["_tlsChecked"],
        message: "Сначала проверьте TLS сертификат и ключ",
      });
    }
  }
});

export const InboundFormSchema = z.discriminatedUnion("type", [
  VlessFormSchema,
  Hy2FormSchema,
]);

export type InboundFormValues = z.input<typeof InboundFormSchema>;
