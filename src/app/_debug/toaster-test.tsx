"use client";

import { toast } from "sonner";

export function ToastTest() {
  return (
    <button
      onClick={() =>
        toast("Toaster Test", {
          description: "description",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Toaster Test
    </button>
  );
}
