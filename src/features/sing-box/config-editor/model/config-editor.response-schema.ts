import { Configuration } from "@black-duty/sing-box-schema";
import { type z } from "zod";

export const ConfigEditorResponseSchema = Configuration;
export type ConfigEditorRequestData = z.infer<
  typeof ConfigEditorResponseSchema
>;
