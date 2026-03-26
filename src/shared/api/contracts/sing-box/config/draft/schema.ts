import { Configuration } from "@black-duty/sing-box-schema";
import { z } from "zod";

const BaseConfigurationSchema = Configuration;
const BaseInboundsSchema = BaseConfigurationSchema.shape.inbounds.unwrap();
const BaseInboundSchema = BaseInboundsSchema.element;

const DraftInboundSchema = BaseInboundSchema.superRefine((inbound, ctx) => {
  if (inbound.type === "vless") {
    const value = (
      inbound as Record<string, unknown> & {
        tls?: {
          reality?: {
            _reality_public_key?: unknown;
          };
        };
      }
    ).tls?.reality?._reality_public_key;

    if (value !== undefined) {
      const result = z.string().min(1).safeParse(value);

      if (!result.success) {
        ctx.addIssue({
          code: "custom",
          path: ["tls", "reality", "_reality_public_key"],
          message: "_reality_public_key must be a non-empty string",
        });
      }
    }
  }

  if (inbound.type === "hysteria2") {
    const value = (
      inbound as Record<string, unknown> & {
        tls?: {
          _is_selfsigned_cert?: unknown;
        };
      }
    ).tls?._is_selfsigned_cert;

    if (value !== undefined && typeof value !== "boolean") {
      ctx.addIssue({
        code: "custom",
        path: ["tls", "_is_selfsigned_cert"],
        message: "_is_selfsigned_cert must be a boolean",
      });
    }
  }
});

export const DraftConfigSchema = BaseConfigurationSchema.extend({
  inbounds: z.array(DraftInboundSchema).optional(),
});
