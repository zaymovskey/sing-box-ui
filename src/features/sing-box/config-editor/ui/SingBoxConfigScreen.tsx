"use client";

import { JsonEditor, type Theme } from "json-edit-react";
import {
  Ban,
  Check,
  CirclePlus,
  Copy,
  FilePenLine,
  PencilOff,
  Save,
  Trash,
} from "lucide-react";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { type Config, ConfigSchema } from "@/shared/api/contracts";
import { isObjectsContentEqual, numWord } from "@/shared/lib/universal";
import {
  Button,
  Card,
  clientToast,
  serverToast,
  sonnerErrorCloseButton,
} from "@/shared/ui";

import { useUpdateConfigMutation } from "../../config-core/model/config-core.mutation";
import { useConfigQuery } from "../../config-core/model/config-core.query";

const buildAllInvalidKeys = (invalidKeys: Set<string>) => {
  const allInvalidKeys: Set<string> = new Set();

  invalidKeys.forEach((invalidKey) => {
    let currentKeyFamilyMember = "";
    const parts = invalidKey.split(".");
    parts.forEach((invalidKeyPart, index) => {
      currentKeyFamilyMember += (index === 0 ? "" : ".") + invalidKeyPart;
      allInvalidKeys.add(currentKeyFamilyMember);
    });
  });

  return new Set(allInvalidKeys);
};

const makeTheme = (invalidKeys: Set<string>): Theme => {
  const isInvalid = (path: (string | number)[]) => {
    const pathString = path.join(".");
    return invalidKeys.has(pathString);
  };

  const invalidBox: CSSProperties = {
    borderRadius: 2,
    padding: "2px 4px",
    background: "color-mix(in srgb, var(--destructive) 12%, transparent)",
  } as const;

  const checkInvalidBox = (path: (string | number)[]) => {
    if (isInvalid(path)) {
      return invalidBox;
    }
    return null;
  };

  return {
    styles: {
      property: ({ path }) => checkInvalidBox(path),
      input: ({ path }) => checkInvalidBox(path),
      string: ({ path }) => checkInvalidBox(path),
      number: ({ path }) => checkInvalidBox(path),
      boolean: ({ path }) => checkInvalidBox(path),
      null: ({ path }) => checkInvalidBox(path),
    },
  };
};

export function SingBoxConfigScreen() {
  const {
    data: singBoxConfig,
    isError: isConfigQueryError,
    isLoading: isConfigQueryLoading,
  } = useConfigQuery();

  const [configDraft, setConfigDraft] = useState<Config | null>(null);
  const [invalidKeys, setInvalidKeys] = useState<Set<string>>(new Set());

  const updateConfigMutation = useUpdateConfigMutation();

  const draftIsDifferent = !isObjectsContentEqual(configDraft, singBoxConfig);

  const mutationServerErrorsToastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isConfigQueryError) {
      serverToast.error("Не удалось загрузить конфигурацию sing-box", {
        id: "load-config",
      });
    } else {
      serverToast.dismiss("load-config");
    }
  }, [isConfigQueryError]);

  const saveConfigChanges = async () => {
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

        mutationServerErrorsToastIdRef.current = serverToast.error(
          `Конфиг не сохранён: ${issues.length} ${numWord(issues.length, ["ошибка", "ошибки", "ошибок"])}`,
          {
            ...sonnerErrorCloseButton,
            duration: 4000,
          },
        );

        const newinvalidKeys = issues
          .map((i) => i.path ?? null)
          .filter((x): x is string => x !== null);

        setInvalidKeys(buildAllInvalidKeys(new Set(newinvalidKeys)));
      },
    });
  };

  const clientErrorsToastIdsRef = useRef<(string | number)[]>([]);

  const dismissClientErrorsToasts = () => {
    clientErrorsToastIdsRef.current.forEach(clientToast.dismiss);
    clientErrorsToastIdsRef.current = [];
  };

  const dismissServerErrorsToasts = () => {
    if (mutationServerErrorsToastIdRef.current) {
      serverToast.dismiss(mutationServerErrorsToastIdRef.current);
      mutationServerErrorsToastIdRef.current = null;
    }
  };

  const onSetChange = (newData: Config) => {
    dismissClientErrorsToasts();

    setConfigDraft(newData);
    const resOfParse = ConfigSchema.safeParse(newData);

    if (!resOfParse.success) {
      const keys = new Set(
        resOfParse.error.issues.map((issue) => {
          return issue.path.join(".");
        }),
      );

      clientErrorsToastIdsRef.current = resOfParse.error.issues.map((issue) => {
        return clientToast.error(
          `Некорректное значение в ${issue.path.join(".")}`,
          {
            description: issue.message,
            ...sonnerErrorCloseButton,
            position: "top-right",
          },
        );
      });

      setInvalidKeys(buildAllInvalidKeys(keys));
      return;
    }

    setInvalidKeys(new Set());
  };

  const theme = useMemo(() => makeTheme(invalidKeys), [invalidKeys]);

  const resetConfigChanges = () => {
    dismissServerErrorsToasts();
    dismissClientErrorsToasts();

    const singBoxConfigCopy = structuredClone(singBoxConfig) as Config;
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

  const icons = useMemo(
    () => ({
      add: (
        <CirclePlus
          className="text-chart-2 hover:text-primary transition-colors"
          size={20}
        />
      ),
      delete: (
        <Trash
          className="text-chart-1 hover:text-primary transition-colors"
          size={20}
        />
      ),
      edit: (
        <FilePenLine
          className="text-muted-foreground hover:text-primary transition-colors"
          size={20}
        />
      ),
      copy: (
        <Copy
          className="text-muted-foreground hover:text-primary transition-colors"
          size={20}
        />
      ),
      ok: (
        <Check
          className="text-chart-2 hover:text-primary transition-colors"
          size={20}
        />
      ),
      cancel: (
        <Ban
          className="text-chart-1 hover:text-primary transition-colors"
          size={20}
        />
      ),
    }),
    [],
  );

  return (
    <Card className="sb-config-editor mb-4 w-190 flex-row gap-3 p-4">
      <JsonEditor
        className="border-border border"
        data={configDraft}
        icons={icons}
        setData={(next) => onSetChange(next as Config)}
        theme={theme}
      />
      <div>
        <div className="fixed flex flex-col gap-1">
          <Button
            disabled={
              invalidKeys.size > 0 || !draftIsDifferent || isConfigQueryLoading
            }
            onClick={saveConfigChanges}
          >
            <Save /> Сохранить
          </Button>
          <Button
            disabled={!draftIsDifferent || isConfigQueryLoading}
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
