import { z } from "zod";

export const configEditorResponseSchema = z.string();
export type configEditorResponse = z.infer<typeof configEditorResponseSchema>;
