import { toast } from "sonner";

export const infraToast = {
  error: (msg: string, opts?: Parameters<typeof toast.error>[1]) =>
    toast.error(msg, { position: "bottom-left", ...opts }),
  success: (msg: string, opts?: Parameters<typeof toast.success>[1]) =>
    toast.success(msg, { position: "bottom-left", ...opts }),
  loading: (msg: string, opts?: Parameters<typeof toast.loading>[1]) =>
    toast.loading(msg, { position: "bottom-left", ...opts }),
  dismiss: (id?: string | number) => toast.dismiss(id),
};

export const clientToast = {
  error: (msg: string, opts?: Parameters<typeof toast.error>[1]) =>
    toast.error(msg, { position: "top-right", ...opts }),
  dismiss: (id?: string | number) => toast.dismiss(id),
};

export const serverToast = {
  error: (msg: string, opts?: Parameters<typeof toast.error>[1]) =>
    toast.error(msg, { position: "top-center", ...opts }),
  success: (msg: string, opts?: Parameters<typeof toast.success>[1]) =>
    toast.success(msg, { position: "top-center", ...opts }),
  loading: (msg: string, opts?: Parameters<typeof toast.loading>[1]) =>
    toast.loading(msg, { position: "top-center", ...opts }),
  dismiss: (id?: string | number) => toast.dismiss(id),
};
