"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

import { cn } from "../lib";
import { Input } from "./input";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  toggleAriaLabel?: {
    show?: string;
    hide?: string;
  };
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, toggleAriaLabel, disabled, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    const ariaShow = toggleAriaLabel?.show ?? "Показать пароль";
    const ariaHide = toggleAriaLabel?.hide ?? "Скрыть пароль";

    return (
      <div className="relative">
        <Input
          ref={ref}
          className={cn("pr-10", className)}
          disabled={disabled}
          type={visible ? "text" : "password"}
          {...props}
        />

        <button
          aria-label={visible ? ariaHide : ariaShow}
          className={cn(
            "text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            "cursor-pointer disabled:pointer-events-none disabled:opacity-50",
          )}
          disabled={disabled}
          type="button"
          onClick={() => setVisible((v) => !v)}
          onMouseDown={(e) => {
            // чтобы при клике не слетал фокус с инпута
            e.preventDefault();
          }}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
