import { useCallback, useEffect } from "react";
import { type UseFormReturn, useWatch } from "react-hook-form";

import {
  type InboundFormValues,
  isUniqueInboundBind,
} from "@/features/sing-box/config-core";

type Params = {
  form: UseFormReturn<InboundFormValues>;
  inbounds: Array<{
    listen?: string;
    listen_port?: number;
    tag?: string;
  }>;
  excludeTag?: string;
};

export function useInboundBindUniqueness({
  form,
  inbounds,
  excludeTag,
}: Params) {
  const listen = useWatch({
    control: form.control,
    name: "listen",
  });

  const listenPort = useWatch({
    control: form.control,
    name: "listen_port",
  });

  const {
    formState: { submitCount, errors },
  } = form;

  const checkBindUniqueAndSetError = useCallback(() => {
    if (!listen || !listenPort) {
      return true;
    }

    const isUnique = isUniqueInboundBind({
      listen,
      listenPort,
      inbounds,
      excludeTag,
    });

    if (!isUnique) {
      if (errors.listen_port?.type !== "custom") {
        form.setError("listen_port", {
          type: "custom",
          message: "Inbound с таким listen и port уже существует",
        });
      }
      return false;
    }

    if (errors.listen_port?.type === "custom") {
      form.clearErrors("listen_port");
    }

    return true;
  }, [listen, listenPort, inbounds, excludeTag, form, errors.listen_port]);

  useEffect(() => {
    if (submitCount === 0) return;

    void checkBindUniqueAndSetError();
  }, [submitCount, checkBindUniqueAndSetError]);

  return checkBindUniqueAndSetError;
}
