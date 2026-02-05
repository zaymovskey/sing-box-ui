import { Configuration } from "@black-duty/sing-box-schema";
import { type z } from "zod";

export const configEditorResponseSchema = Configuration;
export type configEditorResponse = z.infer<typeof configEditorResponseSchema>;
