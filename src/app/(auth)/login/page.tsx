import { LoginForm } from "@/features/auth";

/**
 * Страница логина: центрируем форму.
 */
export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <LoginForm />
    </div>
  );
}
