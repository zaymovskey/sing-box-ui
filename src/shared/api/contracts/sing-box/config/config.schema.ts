import { Configuration } from "@black-duty/sing-box-schema";
import { z } from "zod";

export const PanelMetadataSchema = z.object({
  realityPublicKeys: z.record(z.string(), z.string()),
});

export const ConfigWithMetadataSchema = z.object({
  config: Configuration,
  metadata: PanelMetadataSchema.optional(),
});

export const ConfigSchema = Configuration;

export type Config = z.infer<typeof ConfigSchema>;
export type ConfigWithMetadata = z.infer<typeof ConfigWithMetadataSchema>;
export type PanelMetadata = z.infer<typeof PanelMetadataSchema>;
