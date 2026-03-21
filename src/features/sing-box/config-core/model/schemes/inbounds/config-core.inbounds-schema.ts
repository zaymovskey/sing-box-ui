import { z } from "zod";

import { Hy2FormSchema } from "./inbound-hy2.form-schema";
import { VlessFormSchema } from "./inbound-vless.form-schema";

export const InboundFormSchema = z.discriminatedUnion("type", [
  VlessFormSchema,
  Hy2FormSchema,
]);

export type InboundFormValues = z.input<typeof InboundFormSchema>;
