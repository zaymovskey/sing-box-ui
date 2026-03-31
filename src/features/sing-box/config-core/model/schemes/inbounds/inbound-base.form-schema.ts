import z from "zod";

import { clientEnv, createListenPortSchema } from "@/shared/lib";

export const BaseInboundFormSchema = z.object({
  type: z.enum(["vless", "hysteria2"]),
  tag: z.string().trim().min(1, "Tag обязателен"),
  listen_port: createListenPortSchema({
    rangeStart: clientEnv.NEXT_PUBLIC_PORT_RANGE_START,
    rangeEnd: clientEnv.NEXT_PUBLIC_PORT_RANGE_END,
  }),
  sniff: z.boolean(),
  sniff_override_destination: z.boolean(),
  listen: z.string().trim(),
});
