import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty("Email обязателен")
    .pipe(z.email("Введите корректный email")),
  password: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "Пароль обязателен")),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;
