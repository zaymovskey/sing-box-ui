"use client";

import { JsonEditor } from "json-edit-react";
import { PencilOff, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  configValidation,
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { DraftConfigSchema } from "@/shared/api/contracts";
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

  const [configDraft, setConfigDraft] = useState<unknown>(null);
  const [invalidKeys, setInvalidKeys] = useState<Set<string>>(new Set());

  const updateConfigMutation = useUpdateConfigMutation();

  const {
    dismissClientErrorsToasts,
    dismissServerErrorsToasts,
    showServerToast,
    showClientToasts,
  } = useConfigEditorToasts();

  const draftValidationResult = useMemo(() => {
    return DraftConfigSchema.safeParse(configDraft);
  }, [configDraft]);

  const hasValidationErrors = invalidKeys.size > 0;

  const draftIsDifferent =
    rawDraftConfig !== undefined &&
    !isObjectsContentEqual(configDraft, rawDraftConfig);

  useEffect(() => {
    if (isConfigQueryError) {
      serverToast.error("Не удалось загрузить конфигурацию sing-box", {
        id: "load-config",
      });
      return;
    }

    serverToast.dismiss("load-config");
  }, [isConfigQueryError]);

  const resetConfigChanges = () => {
    dismissServerErrorsToasts();
    dismissClientErrorsToasts();

    setConfigDraft(structuredClone(rawDraftConfig ?? null));
    setInvalidKeys(new Set());
  };

  const onSetChange = (updatedConfigDraft: unknown) => {
    dismissClientErrorsToasts();
    setConfigDraft(updatedConfigDraft);

    const parseResult = DraftConfigSchema.safeParse(updatedConfigDraft);

    if (!parseResult.success) {
      const issuePaths = parseResult.error.issues
        .map((issue) => issue.path.join("."))
        .filter(Boolean);

      showClientToasts(parseResult.error.issues);
      setInvalidKeys(buildInvalidConfigEditorKeys(new Set(issuePaths)));
      return;
    }

    const [newInvalidKeys, issues] = configValidation(parseResult.data);

    if (newInvalidKeys.size > 0) {
      showClientToasts(issues);
      setInvalidKeys(buildInvalidConfigEditorKeys(newInvalidKeys));
      return;
    }

    setInvalidKeys(new Set());
  };

  const saveConfigChanges = () => {
    if (configDraft === null) {
      return;
    }

    dismissServerErrorsToasts();
    dismissClientErrorsToasts();

    const parseResult = DraftConfigSchema.safeParse(configDraft);

    if (!parseResult.success) {
      const issuePaths = parseResult.error.issues
        .map((issue) => issue.path.join("."))
        .filter(Boolean);

      showClientToasts(parseResult.error.issues);
      setInvalidKeys(buildInvalidConfigEditorKeys(new Set(issuePaths)));

      serverToast.error("Исправь ошибки перед сохранением", {
        id: "save-config",
      });
      return;
    }

    const [newInvalidKeys, issues] = configValidation(parseResult.data);

    if (newInvalidKeys.size > 0) {
      showClientToasts(issues);
      setInvalidKeys(buildInvalidConfigEditorKeys(newInvalidKeys));

      serverToast.error("Исправь ошибки перед сохранением", {
        id: "save-config",
      });
      return;
    }

    serverToast.loading("Сохранение...", { id: "save-config" });

    if (!configDraft) {
      serverToast.error("Нет данных для сохранения", {
        id: "save-config",
        duration: 2000,
      });
      return;
    }

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

        showServerToast(issues);

        const newInvalidKeys = issues
          .map((issue) => issue.path ?? null)
          .filter((path): path is string => path !== null);

        setInvalidKeys(buildInvalidConfigEditorKeys(new Set(newInvalidKeys)));
      },
    });
  };

  const theme = useMemo(
    () => makeConfigEditorTheme(invalidKeys),
    [invalidKeys],
  );

  const isConfigInitializedRef = useRef(false);

  useEffect(() => {
    if (rawDraftConfig === undefined) {
      return;
    }

    if (isConfigInitializedRef.current) {
      return;
    }

    setConfigDraft(structuredClone(rawDraftConfig));
    isConfigInitializedRef.current = true;
  }, [rawDraftConfig]);

  useEffect(() => {
    if (configDraft === null) {
      return;
    }

    if (draftValidationResult.success) {
      return;
    }
  }, [configDraft, draftValidationResult]);

  return (
    <Card className="sb-config-editor mb-4 flex-row gap-3 p-4">
      <JsonEditor
        className="border-border border"
        data={configDraft}
        icons={configEditorIcons}
        setData={onSetChange}
        theme={theme}
      />
      <div>
        <div className="fixed flex flex-col gap-1">
          <Button
            disabled={
              hasValidationErrors || !draftIsDifferent || isConfigQueryFetching
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
