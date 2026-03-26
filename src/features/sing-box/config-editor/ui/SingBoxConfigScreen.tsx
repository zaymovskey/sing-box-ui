"use client";

import { JsonEditor } from "json-edit-react";
import { PencilOff, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  configValidation,
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type DraftConfig, DraftConfigSchema } from "@/shared/api/contracts";
import { isObjectsContentEqual } from "@/shared/lib/universal";
import { Button, Card, serverToast } from "@/shared/ui";

import { buildInvalidConfigEditorKeys } from "../lib/build-invalid-config-editor-keys.helper";
import { configEditorIcons } from "../lib/config-editor-icons.constant";
import { makeConfigEditorTheme } from "../lib/make-config-editor-theme.helper";
import { useConfigEditorToasts } from "../lib/use-config-editor-toasts.hook";

export function SingBoxConfigScreen() {
  const {
    data: rawDraftConfig,
    isError: isConfigQueryError,
    isFetching: isConfigQueryFetching,
  } = useConfigQuery();

  const parsedDraftResult = useMemo(() => {
    return DraftConfigSchema.safeParse(rawDraftConfig);
  }, [rawDraftConfig]);

  const singBoxConfig = parsedDraftResult.success
    ? parsedDraftResult.data
    : null;

  const [configDraft, setConfigDraft] = useState<DraftConfig | null>(null);
  const [invalidKeys, setInvalidKeys] = useState<Set<string>>(new Set());

  const updateConfigMutation = useUpdateConfigMutation();

  const isDraftReady = configDraft !== null && singBoxConfig !== null;
  const draftIsDifferent =
    isDraftReady && !isObjectsContentEqual(configDraft, singBoxConfig);

  useEffect(() => {
    if (isConfigQueryError) {
      serverToast.error("Не удалось загрузить конфигурацию sing-box", {
        id: "load-config",
      });
      return;
    }

    if (rawDraftConfig !== undefined && !parsedDraftResult.success) {
      serverToast.error("Черновик конфигурации имеет некорректный формат", {
        id: "load-config",
      });
      return;
    }

    serverToast.dismiss("load-config");
  }, [isConfigQueryError, rawDraftConfig, parsedDraftResult.success]);

  const {
    dismissClientErrorsToasts,
    dismissServerErrorsToasts,
    showServerToast,
    showClientToasts,
  } = useConfigEditorToasts();

  const saveConfigChanges = () => {
    if (invalidKeys.size > 0 || configDraft === null) return;

    dismissServerErrorsToasts();
    dismissClientErrorsToasts();

    serverToast.loading("Сохранение...", { id: "save-config" });

    updateConfigMutation.mutate(configDraft, {
      onSuccess: () => {
        serverToast.success("Конфигурация успешно сохранена", {
          id: "save-config",
          duration: 2000,
        });
      },
      onError: (err) => {
        serverToast.dismiss("save-config");

        const issues = err.issues;

        if (!issues?.length) {
          serverToast.error(err.uiMessage);
          return;
        }

        resetConfigChanges();

        showServerToast(issues);

        const newInvalidKeys = issues
          .map((issue) => issue.path ?? null)
          .filter((path): path is string => path !== null);

        setInvalidKeys(buildInvalidConfigEditorKeys(new Set(newInvalidKeys)));
      },
    });
  };

  const onSetChange = (updatedConfigDraft: DraftConfig) => {
    dismissClientErrorsToasts();

    setConfigDraft(updatedConfigDraft);
    const [invalidKeys, issues] = configValidation(updatedConfigDraft);

    if (invalidKeys.size > 0) {
      showClientToasts(issues);

      setInvalidKeys(buildInvalidConfigEditorKeys(invalidKeys));
      return;
    }

    setInvalidKeys(new Set());
  };

  const theme = useMemo(
    () => makeConfigEditorTheme(invalidKeys),
    [invalidKeys],
  );

  const resetConfigChanges = () => {
    if (!singBoxConfig) return;

    dismissServerErrorsToasts();
    dismissClientErrorsToasts();

    const singBoxConfigCopy = structuredClone(singBoxConfig);
    setConfigDraft(singBoxConfigCopy);
    setInvalidKeys(new Set());
  };

  const isConfigInitializedRef = useRef(false);

  useEffect(() => {
    if (!singBoxConfig) return;
    if (isConfigInitializedRef.current) return;

    setConfigDraft(structuredClone(singBoxConfig));
    isConfigInitializedRef.current = true;
  }, [singBoxConfig]);

  return (
    <Card className="sb-config-editor mb-4 flex-row gap-3 p-4">
      <JsonEditor
        className="border-border border"
        data={configDraft}
        icons={configEditorIcons}
        setData={(next) => onSetChange(next as DraftConfig)}
        theme={theme}
      />
      <div>
        <div className="fixed flex flex-col gap-1">
          <Button
            disabled={
              invalidKeys.size > 0 || !draftIsDifferent || isConfigQueryFetching
            }
            loading={updateConfigMutation.isPending}
            onClick={saveConfigChanges}
          >
            <Save /> Сохранить
          </Button>
          <Button
            disabled={
              !draftIsDifferent ||
              isConfigQueryFetching ||
              updateConfigMutation.isPending
            }
            variant="outline"
            onClick={resetConfigChanges}
          >
            <PencilOff /> Сбросить
          </Button>
        </div>
      </div>
    </Card>
  );
}
