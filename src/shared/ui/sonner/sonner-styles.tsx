import { type toast } from "sonner";

type ToastErrorOptions = NonNullable<Parameters<typeof toast.error>[1]>;

export type ToastCancelOptions = Pick<
  ToastErrorOptions,
  "cancel" | "cancelButtonStyle"
>;

export const sonnerErrorCloseButton: ToastCancelOptions = {
  cancelButtonStyle: {
    backgroundColor: "var(--destructive)",
    color: "var(--secondary)",
  },
  cancel: {
    label: "Закрыть",
    onClick: () => {},
  },
};
