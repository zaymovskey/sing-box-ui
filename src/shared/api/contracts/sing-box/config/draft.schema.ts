import { Configuration } from "@black-duty/sing-box-schema";
import { z } from "zod";

const BaseConfigurationSchema = Configuration;
const BaseInboundsSchema = BaseConfigurationSchema.shape.inbounds.unwrap();
const BaseInboundSchema = BaseInboundsSchema.element;

const DraftVlessInboundExtensionSchema = z.object({
  type: z.literal("vless"),
  tls: z
    .object({
      reality: z
        .object({
          _reality_public_key: z.string().min(1).optional(),
        })
        .optional(),
    })
    .optional(),
});

const DraftHysteria2InboundExtensionSchema = z.object({
  type: z.literal("hysteria2"),
  tls: z
    .object({
      _is_selfsigned_cert: z.boolean().optional(),
    })
    .optional(),
});

const DraftInboundSchema = z.union([
  BaseInboundSchema.and(DraftVlessInboundExtensionSchema),
  BaseInboundSchema.and(DraftHysteria2InboundExtensionSchema),
  BaseInboundSchema,
]);

export const DraftConfigSchema = BaseConfigurationSchema.extend({
  inbounds: BaseInboundsSchema.pipe(z.array(DraftInboundSchema)),
});

export type DraftConfig = z.infer<typeof DraftConfigSchema>;
export type DraftInbound = z.infer<typeof DraftInboundSchema>;
