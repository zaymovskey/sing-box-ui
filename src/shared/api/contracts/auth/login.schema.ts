import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z
    .string()
    .transform((v) => v.trim().toLowerCase())
    .pipe(z.email("Введите корректный email")),
  password: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "Пароль обязателен")),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
