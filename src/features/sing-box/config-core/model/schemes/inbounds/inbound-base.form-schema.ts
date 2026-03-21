import z from "zod";

export const BaseInboundFormSchema = z.object({
  type: z.enum(["vless", "hysteria2"]),
  tag: z.string().trim().min(1, "Tag обязателен"),
  listen_port: z
    .number("Порт должен быть числом")
    .int("Порт должен быть целым числом")
    .min(1, "Минимум 1")
    .max(65535, "Максимум 65535"),
  sniff: z.boolean(),
  sniff_override_destination: z.boolean(),
  listen: z.string().trim(),
});
