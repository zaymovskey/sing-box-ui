"use client";

import { JsonEditor, type Theme } from "json-edit-react";
import { Ban, Check, CirclePlus, Copy, FilePenLine, Trash } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import { toast } from "sonner";

import { useConfigJsonQuery } from "../model/config-editor.query";
import {
  type configEditorResponse,
  configEditorResponseSchema,
} from "../model/config-editor.response-schema";

export function SingBoxConfigScreen() {
  const { data: singBoxConfig } = useConfigJsonQuery();

  const [draft, setDraft] = useState<configEditorResponse | null>(null);
  const [invalidKeys, setInvalidKeys] = useState<Set<string>>(new Set());
  const [toastIds, setToastIds] = useState<(string | number)[]>([]);

  const onSetChange = (newData: configEditorResponse) => {
    toastIds.forEach((id) => toast.dismiss(id));
    setToastIds([]);

    setDraft(newData);
    const resOfParse = configEditorResponseSchema.safeParse(newData);

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
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
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

  useEffect(() => {
    if (!singBoxConfig) return;
    if (draft !== null) return;

    setDraft(structuredClone(singBoxConfig));
  }, [singBoxConfig, draft]);

  return (
    <div className="sb-config-editor">
      <JsonEditor
        className="border-border border"
        data={draft}
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
        setData={(next) => onSetChange(next as configEditorResponse)}
        theme={makeTheme(invalidKeys)}
      />
    </div>
  );
}
