import { z } from "zod";

export const configEditorResponseSchema = z.record(z.string(), z.unknown());
export type configEditorResponse = z.infer<typeof configEditorResponseSchema>;
