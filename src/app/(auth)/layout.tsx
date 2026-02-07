import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="grid min-h-dvh place-items-center">{children}</div>;
}
