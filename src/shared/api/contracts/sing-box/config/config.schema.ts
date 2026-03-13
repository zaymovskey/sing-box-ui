import { Configuration } from "@black-duty/sing-box-schema";
import { z } from "zod";

const PanelMetadataSchema = z.object({
  realityPublicKeys: z.record(z.string(), z.string()),
});

export const ConfigSchema = Configuration.extend({
  _panel: PanelMetadataSchema.optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
export type PanelMetadata = z.infer<typeof PanelMetadataSchema>;
