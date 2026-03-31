import z from "zod";

import { clientEnv } from "@/shared/lib";

export const BaseInboundFormSchema = z.object({
  type: z.enum(["vless", "hysteria2"]),
  tag: z.string().trim().min(1, "Tag обязателен"),
  listen_port: z
    .number("Порт должен быть числом")
    .int("Порт должен быть целым числом")
    .min(1, "Минимум 1")
    .max(65535, "Максимум 65535")
    .refine(
      (port) => {
        return (
          port === 443 ||
          port === 8443 ||
          (port >= clientEnv.NEXT_PUBLIC_PORT_RANGE_START &&
            port <= clientEnv.NEXT_PUBLIC_PORT_RANGE_END)
        );
      },
      {
        message: `Порт должен быть 443, 8443 или в диапазоне ${clientEnv.NEXT_PUBLIC_PORT_RANGE_START}-${clientEnv.NEXT_PUBLIC_PORT_RANGE_END}`,
      },
    ),
  sniff: z.boolean(),
  sniff_override_destination: z.boolean(),
  listen: z.string().trim(),
});
