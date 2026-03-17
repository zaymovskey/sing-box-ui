import { type toast } from "sonner";

type ToastErrorOptions = NonNullable<Parameters<typeof toast.error>[1]>;

export type ToastCancelOptions = Pick<
  ToastErrorOptions,
  "cancel" | "cancelButtonStyle"
>;

export const sonnerErrorCloseButton: ToastCancelOptions = {
  cancelButtonStyle: {
    backgroundColor: "var(--destructive-foreground)",
    color: "white",
  },
  cancel: {
    label: "Закрыть",
    onClick: () => {},
  },
};
