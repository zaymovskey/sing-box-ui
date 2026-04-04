"use client";

import { useFormContext } from "react-hook-form";

function RootErrorMessage({ className, ...props }: React.ComponentProps<"p">) {
  const {
    formState: { errors },
  } = useFormContext();

  const message = errors.root?.message;

  if (!message) return null;

  return (
    <p
      className={className ?? "text-destructive text-center text-sm"}
      {...props}
    >
      {message}
    </p>
  );
}

export { RootErrorMessage };
