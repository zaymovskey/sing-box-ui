import { useEffect } from "react";

import { type ApiError } from "@/shared/lib";
import { serverToast, sonnerErrorCloseButton } from "@/shared/ui";

export function useConfigQueryToasts(error: ApiError | null) {
  useEffect(() => {
    if (!error) return;

    if (error.code === "SINGBOX_CONFIG_INVALID") {
      const description =
        error.issues?.map((i) => i.path).join(", ") ?? "Ошибка конфигурации";

      serverToast.error("Некорректный формат конфига sing-box", {
        id: "singbox-config-invalid",
        description,
        ...sonnerErrorCloseButton,
      });

      return;
    }

    serverToast.error(error.message, {
      id: "singbox-config-error",
      ...sonnerErrorCloseButton,
    });
  }, [error]);
}
