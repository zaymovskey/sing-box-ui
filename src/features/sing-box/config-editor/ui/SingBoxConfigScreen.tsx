"use client";

import { githubLightTheme, JsonEditor } from "json-edit-react";
import { Ban, Check, CirclePlus, Copy, FilePenLine, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { useConfigTextQuery } from "../model/config-editor.query";
import { type configEditorResponse } from "../model/config-editor.response-schema";

export function SingBoxConfigScreen() {
  const { data: singBoxConfig } = useConfigTextQuery();

  const [draft, setDraft] = useState<configEditorResponse | null>(null);

  const onDraftChange = (next: configEditorResponse) => {
    setDraft(next);
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
          ok: <Check size={20} />,
          cancel: <Ban className="" size={20} />,
        }}
        setData={(next) => onDraftChange(next as configEditorResponse)}
        theme={githubLightTheme}
      />
    </div>
  );
}
