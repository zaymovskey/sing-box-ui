import z from "zod";

export const BaseInboundFormSchema = z.object({
  type: z.enum(["vless", "hysteria2"]),
  tag: z.string().trim().min(1, "Tag обязателен"),
  listen_port: z.number().int().min(1).max(65535),
  sniff: z.boolean(),
  sniff_override_destination: z.boolean(),
  listen: z.string().trim(),
});
