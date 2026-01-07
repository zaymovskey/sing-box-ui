import { z } from "zod";

const clientEnvSchema = z.object({
  // пример, если понадобится:
  // NEXT_PUBLIC_APP_NAME: z.string().min(1).default("sing-box-ui"),
  // NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  // если пока нет — оставь пустым объектом:
});

type ClientEnv = z.infer<typeof clientEnvSchema>;

// В Next на клиенте env доступны как process.env.NEXT_PUBLIC_...
// но чтобы не тащить process.env в UI, мы экспортируем clientEnv
export const clientEnv: ClientEnv = clientEnvSchema.parse({
  // NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  // NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
