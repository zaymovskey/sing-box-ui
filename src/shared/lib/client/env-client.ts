import { z } from "zod";

const clientEnvSchema = z
  .object({
    NEXT_PUBLIC_HOST_IP: z.string().optional(),
    NEXT_PUBLIC_NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXT_PUBLIC_SINGBOX_CERTS_DIR: z.string(),
    NEXT_PUBLIC_PORT_RANGE_START: z.coerce.number().int().positive(),
    NEXT_PUBLIC_PORT_RANGE_END: z.coerce.number().int().positive(),
  })
  .superRefine((env, ctx) => {
    if (env.NEXT_PUBLIC_PORT_RANGE_START > env.NEXT_PUBLIC_PORT_RANGE_END) {
      ctx.addIssue({
        code: "custom",
        path: ["PORT_RANGE_END"],
        message:
          "PORT_RANGE_END must be greater than or equal to PORT_RANGE_START",
      });
    }
  });

type ClientEnv = z.infer<typeof clientEnvSchema>;

export const clientEnv: ClientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_HOST_IP: process.env.NEXT_PUBLIC_HOST_IP,
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_SINGBOX_CERTS_DIR: process.env.NEXT_PUBLIC_SINGBOX_CERTS_DIR,
  NEXT_PUBLIC_PORT_RANGE_START: process.env.NEXT_PUBLIC_PORT_RANGE_START,
  NEXT_PUBLIC_PORT_RANGE_END: process.env.NEXT_PUBLIC_PORT_RANGE_END,
});
