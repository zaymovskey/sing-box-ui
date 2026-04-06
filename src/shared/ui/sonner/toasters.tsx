import { toast } from "sonner";

type Message = string | React.ReactNode;

export const infraToast = {
  error: (msg: Message, opts?: Parameters<typeof toast.error>[1]) =>
    toast.error(msg, {
      position: "bottom-left",
      toasterId: "bottom-left",
      ...opts,
    }),
  success: (msg: Message, opts?: Parameters<typeof toast.success>[1]) =>
    toast.success(msg, {
      position: "bottom-left",
      toasterId: "bottom-left",
      ...opts,
    }),
  loading: (msg: Message, opts?: Parameters<typeof toast.loading>[1]) =>
    toast.loading(msg, {
      position: "bottom-left",
      toasterId: "bottom-left",
      ...opts,
    }),
  dismiss: (id?: string | number) => toast.dismiss(id),
};

export const clientToast = {
  error: (msg: Message, opts?: Parameters<typeof toast.error>[1]) =>
    toast.error(msg, {
      position: "top-right",
      toasterId: "top-right",
      ...opts,
    }),
  success: (msg: Message, opts?: Parameters<typeof toast.success>[1]) =>
    toast.success(msg, {
      position: "top-right",
      toasterId: "top-right",
      ...opts,
    }),
  loading: (msg: Message, opts?: Parameters<typeof toast.loading>[1]) =>
    toast.loading(msg, {
      position: "top-right",
      toasterId: "top-right",
      ...opts,
    }),
  dismiss: (id?: string | number) => toast.dismiss(id),
};

export const serverToast = {
  error: (msg: Message, opts?: Parameters<typeof toast.error>[1]) =>
    toast.error(msg, {
      position: "top-center",
      toasterId: "top-center",
      ...opts,
    }),
  success: (msg: Message, opts?: Parameters<typeof toast.success>[1]) =>
    toast.success(msg, {
      position: "top-center",
      toasterId: "top-center",
      ...opts,
    }),
  loading: (msg: Message, opts?: Parameters<typeof toast.loading>[1]) =>
    toast.loading(msg, {
      position: "top-center",
      toasterId: "top-center",
      ...opts,
    }),
  dismiss: (id?: string | number) => toast.dismiss(id),
};
