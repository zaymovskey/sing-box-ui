import z from "zod";

export const BaseInboundFormSchema = z.object({
  type: z.enum(["vless", "hysteria2"]),
  display_tag: z.string().trim().min(1, "Укажите тег"),
  listen_port: z
    .number()
    .positive()
    .min(1, "Минимум 1")
    .max(65535, "Максимум 65535"),
  sniff: z.boolean(),
  sniff_override_destination: z.boolean(),
  listen: z.string().trim().min(1, "Укажите listen"),
});
