import "./globals.css";

import type { ReactNode } from "react";

import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
