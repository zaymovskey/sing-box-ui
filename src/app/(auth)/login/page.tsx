import { type Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
