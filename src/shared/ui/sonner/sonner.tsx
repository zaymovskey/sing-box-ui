"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <>
      <Sonner
        richColors
        duration={Infinity}
        id="top-center"
        offset={{ top: "60px" }}
        position="top-center"
      />

      <Sonner
        richColors
        duration={Infinity}
        id="top-right"
        offset={{ top: "60px", right: "10px" }}
        position="top-right"
      />

      <Sonner
        richColors
        duration={Infinity}
        id="bottom-left"
        position="bottom-left"
      />
    </>
  );
}
