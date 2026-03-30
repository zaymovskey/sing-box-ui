"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { type TLSCheckItem } from "@/shared/api/contracts";
import { clientEnv } from "@/shared/lib";
import { clientToast, UncontrolledPathField } from "@/shared/ui";

import { useFileTLSCheckMutation } from "../../../model/mutations/TLS/file-tls-check.mutation";
import { useFileTLSGenerateMutation } from "../../../model/mutations/TLS/file-tls-generate.mutation";
import { type SecurityAssetFormValues } from "../../../model/security-asset-form.schema";
import { useSecurityAssetFormContext } from "../../../model/security-assets-form-ui.context";
import { TLSFileTools, type TlsStatuses } from "./TLSFileTools";

const messageByCheckResultMap = {
  success: "Успешно",
  not_found: "Файл не найден",
  no_access: "Нет доступа к файлу",
  invalid: "Недействительный файл",
  mismatch: "Сертификат и ключ не совпадают",
  skipped: "Проверка пропущена",
  outside_allowed_dir: "Файл находится вне разрешенной директории",
} satisfies Record<TLSCheckItem, string>;

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

export function TLSFileToolsSection() {
  const { mode } = useSecurityAssetFormContext();

  const { mutateAsync: checkMutateAsync } = useFileTLSCheckMutation();
  const { mutateAsync: generateMutateAsync } = useFileTLSGenerateMutation();

  const { control, setValue, clearErrors, getFieldState, formState, trigger } =
    useFormContext<SecurityAssetFormValues>();

  const certificatePath = useWatch({
    control,
    name: "source.certificatePath",
  });

  const keyPath = useWatch({
    control,
    name: "source.keyPath",
  });

  const serverName = useWatch({
    control,
    name: "serverName",
  });

  const tlsOverwrite =
    useWatch({
      control,
      name: "_tlsOverwrite",
    }) ?? false;

  const [statuses, setStatuses] = useState<TlsStatuses>(idleStatuses);
  const [generateError, setGenerateError] = useState("");

  const handleCheck = useCallback(async () => {
    const isValid = await trigger(["source.certificatePath", "source.keyPath"]);

    if (!isValid) {
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
        setValue("source._tlsChecked", true, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
        const isSelfSigned = result.isSelfSigned ?? false;
        setValue("source._is_selfsigned_cert", isSelfSigned, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
        clearErrors("source._tlsChecked");
        setGenerateError("");
      } else {
        setValue("source._tlsChecked", false, {
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
    trigger,
    checkMutateAsync,
    certificatePath,
    keyPath,
    setValue,
    clearErrors,
  ]);

  const handleGenerate = async () => {
    const isValid = await trigger([
      "serverName",
      "source.certificatePath",
      "source.keyPath",
    ]);

    if (!isValid) {
      clientToast.error("Заполните serverName, certificate path и key path", {
        duration: 2000,
      });
      return;
    }

    setStatuses(generatingStatuses);
    setGenerateError("");

    try {
      if (!serverName) {
        clientToast.error("Укажите serverName для генерации TLS", {
          duration: 2000,
        });
        setStatuses(idleStatuses);
        return;
      }

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

      setValue("source._is_selfsigned_cert", true, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      await handleCheck();
    } catch {
      setStatuses(idleStatuses);
      setGenerateError("Не удалось сгенерировать TLS сертификаты");
    }
  };

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    setStatuses(idleStatuses);
    setGenerateError("");

    setValue("source._tlsChecked", false, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [certificatePath, keyPath, setValue]);

  useEffect(() => {
    if (mode !== "edit") return;
    if (!certificatePath || !keyPath) return;

    void handleCheck();
  }, [mode, certificatePath, keyPath, handleCheck]);

  const error = getFieldState("source._tlsChecked", formState).error;

  return (
    <>
      <UncontrolledPathField<SecurityAssetFormValues>
        className="mb-5"
        label="Certificate path (.crt)"
        name="source.certificatePath"
        path={clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR}
        placeholder="cert.crt"
      />

      <UncontrolledPathField<SecurityAssetFormValues>
        className="mb-5"
        label="Key path (.key)"
        name="source.keyPath"
        path={clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR}
        placeholder="key.key"
      />

      <TLSFileTools
        error={error?.message}
        generateError={generateError}
        statuses={statuses}
        onCheck={handleCheck}
        onGenerate={handleGenerate}
      />
    </>
  );
}
