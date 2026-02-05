import { Configuration } from "@black-duty/sing-box-schema";
import { type z } from "zod";

export const ConfigSchema = Configuration;
export type Config = z.infer<typeof ConfigSchema>;
