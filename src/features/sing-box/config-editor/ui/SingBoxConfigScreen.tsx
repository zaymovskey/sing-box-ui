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
import { toast } from "sonner";

import { isObjectsContentEqual } from "@/shared/lib/universal";
import { Button } from "@/shared/ui";

import { useUpdateConfigMutation } from "../model/config-editor.mutation";
import { useConfigQuery } from "../model/config-editor.query";
import { type Config, ConfigSchema } from "../model/config-editor.schema";

export function SingBoxConfigScreen() {
  const { data: singBoxConfig } = useConfigQuery();

  const [configDraft, setConfigDraft] = useState<Config | null>(null);
  const [invalidKeys, setInvalidKeys] = useState<Set<string>>(new Set());
  const [toastIds, setToastIds] = useState<(string | number)[]>([]);

  const updateConfigMutation = useUpdateConfigMutation();

  const draftIsDifferent = !isObjectsContentEqual(configDraft, singBoxConfig);

  const saveConfigChanges = async () => {
    if (invalidKeys.size > 0 || configDraft === null) return;

    toast.promise(
      () => {
        return updateConfigMutation.mutateAsync(configDraft);
      },
      {
        loading: "Загрузка...",
        success: () => `Сохранено`,
        error: "Ошибка при сохранении конфигурации",
        duration: 1000,
      },
    );
  };

  const toastIdsRef = useRef<(string | number)[]>([]);

  const dismissToasts = () => {
    toastIdsRef.current.forEach(toast.dismiss);
    toastIdsRef.current = [];
  };

  const onSetChange = (newData: Config) => {
    dismissToasts();
    setToastIds([]);

    setConfigDraft(newData);
    const resOfParse = ConfigSchema.safeParse(newData);

    if (!resOfParse.success) {
      const keys = new Set(
        resOfParse.error.issues.map((issue) => {
          return issue.path.join(".");
        }),
      );

      toastIdsRef.current = resOfParse.error.issues.map((issue) => {
        return toast.error(`Некорретное значение в ${issue.path.join(".")}`, {
          description: issue.message,
          cancelButtonStyle: {
            backgroundColor: "var(--destructive)",
            color: "var(--secondary)",
          },
          cancel: {
            label: "Закрыть",
            onClick: () => {},
          },
          position: "top-right",
        });
      });
      setInvalidKeys(keys);
      return;
    }

    setInvalidKeys(new Set());
  };

  const makeTheme = (invalidKeys: Set<string>): Theme => {
    const isInvalid = (path: (string | number)[]) => {
      const pathString = path.join(".");
      for (const invalid of invalidKeys) {
        if (invalid === pathString || invalid.startsWith(pathString + "."))
          return true;
      }

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

  const theme = useMemo(() => makeTheme(invalidKeys), [invalidKeys]);

  const resetConfigChanges = () => {
    const singBoxConfigCopy = structuredClone(singBoxConfig) as Config;
    setConfigDraft(singBoxConfigCopy);
    setInvalidKeys(new Set());
    toastIds.forEach((id) => toast.dismiss(id));
    setToastIds([]);
  };

  const isConfigInitializedRef = useRef(false);

  useEffect(() => {
    if (!singBoxConfig) return;
    if (isConfigInitializedRef.current) return;

    setConfigDraft(structuredClone(singBoxConfig));
    isConfigInitializedRef.current = true;
  }, [singBoxConfig, configDraft]);

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
    <div className="sb-config-editor flex gap-1">
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
            disabled={invalidKeys.size > 0 || !draftIsDifferent}
            onClick={saveConfigChanges}
          >
            <Save /> Сохранить
          </Button>
          <Button
            disabled={!draftIsDifferent}
            variant="outline"
            onClick={resetConfigChanges}
          >
            <PencilOff /> Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
}
