import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;
