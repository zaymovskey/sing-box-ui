"use client";

import { RotateCcw } from "lucide-react";
import * as React from "react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { Button } from "./button";
import { Input } from "./input";

type Props = ComponentPropsWithoutRef<"input"> & {
  generateFunction: () => string;
};

export const InputWithGenerate = forwardRef<HTMLInputElement, Props>(
  ({ generateFunction, ...props }, forwardedRef) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const setRef = (node: HTMLInputElement | null) => {
      innerRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const handleGenerate = () => {
      const value = generateFunction();
      const el = innerRef.current;
      if (!el) return;

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;

      nativeInputValueSetter?.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };

    return (
      <div className="flex items-center gap-0.5">
        <Button type="button" variant="outline" onClick={handleGenerate}>
          <RotateCcw className="size-4" />
        </Button>

        <Input ref={setRef} {...props} />
      </div>
    );
  },
);

InputWithGenerate.displayName = "InputWithGenerate";
