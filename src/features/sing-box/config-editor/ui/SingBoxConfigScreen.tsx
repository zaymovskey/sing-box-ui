"use client";

import { JsonEditor, type Theme } from "json-edit-react";
import { Ban, Check, CirclePlus, Copy, FilePenLine, Trash } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import { toast } from "sonner";

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

  const saveConfigChanges = () => {
    if (invalidKeys.size > 0 || configDraft === null) return;

    try {
      updateConfigMutation.mutateAsync(configDraft);
    } catch (error) {
      console.error("Failed to save config changes:", error);
    }
  };

  const onSetChange = (newData: Config) => {
    toastIds.forEach((id) => toast.dismiss(id));
    setToastIds([]);

    setConfigDraft(newData);
    const resOfParse = ConfigSchema.safeParse(newData);

    if (!resOfParse.success) {
      const keys = new Set(
        resOfParse.error.issues.map((issue) => {
          return issue.path.join(".");
        }),
      );

      resOfParse.error.issues.forEach((issue) => {
        const toastId = toast.error(
          `Некорретное значение в ${issue.path.join(".")}`,
          {
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
          },
        );
        setToastIds([...toastIds, toastId]);
      });
      setInvalidKeys(keys);
      return;
    }

    setInvalidKeys(new Set());
  };

  const makeTheme = (invalidKeys: Set<string>): Theme => {
    const isInvalid = (path: (string | number)[]) => {
      const key = path.join(".");
      if (invalidKeys.has(key)) return true;
      return false;
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

  const resetConfigChanges = () => {
    const singBoxConfigCopy = structuredClone(singBoxConfig) as Config;
    setConfigDraft(singBoxConfigCopy);
    setInvalidKeys(new Set());
    toastIds.forEach((id) => toast.dismiss(id));
    setToastIds([]);
  };

  useEffect(() => {
    if (!singBoxConfig) return;
    if (configDraft !== null) return;

    setConfigDraft(structuredClone(singBoxConfig));
  }, [singBoxConfig, configDraft]);

  return (
    <div className="sb-config-editor flex gap-1">
      <JsonEditor
        className="border-border border"
        data={configDraft}
        icons={{
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
        }}
        setData={(next) => onSetChange(next as Config)}
        theme={makeTheme(invalidKeys)}
      />
      <div>
        <div className="fixed flex flex-col gap-1">
          <Button disabled={invalidKeys.size > 0} onClick={saveConfigChanges}>
            Сохранить
          </Button>
          <Button variant="outline" onClick={resetConfigChanges}>
            Отменить
          </Button>
        </div>
      </div>
    </div>
  );
}
