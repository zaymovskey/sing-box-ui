import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .transform((v) => v.trim().toLowerCase())
    .pipe(z.email("Введите корректный email")),
  password: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "Пароль обязателен")),
});
export type LoginData = z.infer<typeof LoginSchema>;
