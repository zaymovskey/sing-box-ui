import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type Hy2TlsCheckItem } from "@/shared/api/contracts";
import { clientEnv } from "@/shared/lib";
import { clientToast } from "@/shared/ui";

import { useHy2TlsCheckMutation } from "../../../model/commands/hy2/hy2-tls-check.mutation";
import { useHy2TlsGenerateMutation } from "../../../model/commands/hy2/hy2-tls-generate.mutation";
import { useInboundFormContext } from "../../../model/inbound-form-ui.context";
import { Hy2TlsTools, type TlsStatuses } from "./Hy2TlsTools";

const messageByCheckResultMap = {
  success: "Успешно",
  not_found: "Файл не найден",
  no_access: "Нет доступа к файлу",
  invalid: "Недействительный файл",
  mismatch: "Сертификат и ключ не совпадают",
  skipped: "Проверка пропущена",
  outside_allowed_dir: "Файл находится вне разрешенной директории",
} satisfies Record<Hy2TlsCheckItem, string>;

const idleStatuses: TlsStatuses = {
  crt: { status: "idle", message: "Не проверено" },
  key: { status: "idle", message: "Не проверено" },
  pair: { status: "idle", message: "Не проверено" },
};

const loadingStatuses: TlsStatuses = {
  crt: { status: "loading", message: "Проверка..." },
  key: { status: "loading", message: "Проверка..." },
  pair: { status: "loading", message: "Проверка..." },
};

const generatingStatuses: TlsStatuses = {
  crt: { status: "generating", message: "Генерация..." },
  key: { status: "generating", message: "Генерация..." },
  pair: { status: "generating", message: "Генерация..." },
};

const successesStatuses: TlsStatuses = {
  crt: { status: "success", message: "Успешно" },
  key: { status: "success", message: "Успешно" },
  pair: { status: "success", message: "Успешно" },
};

export function Hy2TlsToolsSection() {
  const { mode } = useInboundFormContext();

  const { mutateAsync: checkMutateAsync } = useHy2TlsCheckMutation();
  const { mutateAsync: generateMutateAsync } = useHy2TlsGenerateMutation();
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

  const serverName = useWatch({
    control,
    name: "tls_server_name",
  });

  const tlsOverwrite =
    useWatch({
      control,
      name: "_tlsOverwrite",
    }) ?? false;

  const [statuses, setStatuses] = useState<TlsStatuses>(idleStatuses);

  const [generateError, setGenerateError] = useState<string>("");

  const handleCheck = useCallback(async () => {
    if (!tlsEnabled || !certificatePath || !keyPath) {
      return;
    }

    setStatuses(loadingStatuses);

    try {
      const result = await checkMutateAsync({
        certificatePath:
          clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR + certificatePath,
        keyPath: clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR + keyPath,
      });

      setStatuses({
        crt: {
          status: result.cert === "success" ? "success" : "error",
          message: messageByCheckResultMap[result.cert],
        },
        key: {
          status: result.key === "success" ? "success" : "error",
          message: messageByCheckResultMap[result.key],
        },
        pair: {
          status: result.pair === "success" ? "success" : "error",
          message: messageByCheckResultMap[result.pair],
        },
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
        setGenerateError("");
      } else {
        setValue("_tlsChecked", false, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    } catch {
      setStatuses(idleStatuses);

      clientToast.error("Не удалось проверить TLS сертификаты", {
        duration: 2000,
      });
    }
  }, [
    checkMutateAsync,
    clearErrors,
    setValue,
    tlsEnabled,
    certificatePath,
    keyPath,
  ]);

  const handleGenerate = async () => {
    if (!tlsEnabled || !certificatePath || !keyPath || !serverName) {
      return;
    }

    setStatuses(generatingStatuses);
    setGenerateError("");

    try {
      const result = await generateMutateAsync({
        certificatePath:
          clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR + certificatePath,
        keyPath: clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR + keyPath,
        serverName,
        overwrite: tlsOverwrite,
      });

      if (result.result === "error") {
        setGenerateError(result.message);
        setStatuses(idleStatuses);
        return;
      }

      if (result.result === "conflict") {
        setGenerateError(result.message);
        setStatuses(idleStatuses);
        return;
      }

      setGenerateError("");
      setStatuses(successesStatuses);
      setValue("_is_selfsigned_cert", true, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      await handleCheck();
    } catch {
      setGenerateError("Не удалось сгенерировать TLS сертификаты");
    }
  };

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Не сбрасываем статусы при первом рендере
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    setStatuses(idleStatuses);
    setGenerateError("");
    setValue("_tlsChecked", false, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [certificatePath, keyPath, tlsEnabled, setValue]);

  useEffect(() => {
    if (mode !== "edit") return;

    if (!tlsEnabled || !certificatePath || !keyPath) return;

    void handleCheck();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useFormContext<InboundFormValues>();

  const error = form.getFieldState("_tlsChecked", form.formState).error;

  return (
    <Hy2TlsTools
      disabled={!tlsEnabled}
      error={error?.message}
      generateError={generateError}
      statuses={statuses}
      onCheck={handleCheck}
      onGenerate={handleGenerate}
    />
  );
}
