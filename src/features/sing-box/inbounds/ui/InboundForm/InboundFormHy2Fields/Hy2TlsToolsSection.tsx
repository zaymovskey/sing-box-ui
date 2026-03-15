import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { clientToast } from "@/shared/ui";

import { useHy2TlsCheckMutation } from "../../../model/commands/hy2/hy2-tls-check.mutation";
import { Hy2TlsTools, type TlsStatuses } from "./Hy2TlsTools";

export function Hy2TlsToolsSection() {
  const { mutateAsync } = useHy2TlsCheckMutation();
  const { control, setValue, clearErrors } =
    useFormContext<InboundFormValues>();

  const tlsEnabled = useWatch({
    control,
    name: "tls_enabled",
  });

  const certificatePath = useWatch({
    control,
    name: "certificate_path",
  });

  const keyPath = useWatch({
    control,
    name: "key_path",
  });

  const [statuses, setStatuses] = useState<TlsStatuses>({
    crt: "idle",
    key: "idle",
    pair: "idle",
  });

  useEffect(() => {
    setStatuses({
      crt: "idle",
      key: "idle",
      pair: "idle",
    });
    setValue("_tlsChecked", false, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [certificatePath, keyPath, setValue, tlsEnabled]);

  const handleCheck = async () => {
    if (!tlsEnabled || !certificatePath || !keyPath) {
      return;
    }

    setStatuses({
      crt: "loading",
      key: "loading",
      pair: "loading",
    });

    try {
      const result = await mutateAsync({
        certificatePath,
        keyPath,
      });

      setStatuses({
        crt: result.cert === "success" ? "success" : "error",
        key: result.key === "success" ? "success" : "error",
        pair: result.pair === "success" ? "success" : "error",
      });

      const isAllSuccess = [result.cert, result.key, result.pair].every(
        (status) => status === "success",
      );

      if (isAllSuccess) {
        setValue("_tlsChecked", true, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
        clearErrors("_tlsChecked");
      } else {
        setValue("_tlsChecked", false, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    } catch {
      setStatuses({
        crt: "idle",
        key: "idle",
        pair: "idle",
      });

      clientToast.error("Не удалось проверить TLS сертификаты");
    }
  };

  return (
    <Hy2TlsTools
      disabled={!tlsEnabled}
      statuses={statuses}
      onCheck={handleCheck}
      onGenerate={() => {}}
    />
  );
}
