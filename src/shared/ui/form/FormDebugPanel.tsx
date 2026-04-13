"use client";

import { useMemo, useState } from "react";
import {
  type Control,
  type FieldValues,
  type UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";

type FloatingFormDebugProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  title?: string;
};

function JsonBlock({ value }: { value: unknown }) {
  const formatted = useMemo(() => JSON.stringify(value, null, 2), [value]);

  return (
    <pre className="max-h-64 overflow-auto rounded-md border bg-black/90 p-3 text-xs text-white">
      {formatted}
    </pre>
  );
}

export function FormDebugPanel<T extends FieldValues>({
  form,
  title = "RHF Debug",
}: FloatingFormDebugProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "meta" | "values" | "errors" | "dirty" | "touched" | "defaults"
  >("values");

  const values = useWatch({
    control: form.control as Control<T>,
  });

  const {
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    submitCount,
    errors,
    dirtyFields,
    touchedFields,
    defaultValues,
  } = useFormState({
    control: form.control as Control<T>,
  });

  return (
    <div className="fixed bottom-4 left-4 z-9999">
      <button
        className="bg-background hover:bg-accent rounded-md border px-3 py-2 text-sm shadow-lg"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Закрыть RHF Debug" : "Открыть RHF Debug"}
      </button>

      {open && (
        <div className="bg-background mt-2 flex h-[70vh] w-[520px] flex-col rounded-xl border shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <div className="text-sm font-semibold">{title}</div>
              <div className="text-muted-foreground text-xs">
                Локальная debug-панель формы
              </div>
            </div>

            <button
              className="hover:bg-accent rounded-md border px-2 py-1 text-xs"
              type="button"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="flex flex-wrap gap-2 border-b px-3 py-2">
            {[
              ["meta", "Meta"],
              ["values", "Values"],
              ["errors", "Errors"],
              ["dirty", "Dirty"],
              ["touched", "Touched"],
              ["defaults", "Defaults"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`rounded-md border px-2 py-1 text-xs ${
                  activeTab === key ? "bg-accent" : ""
                }`}
                type="button"
                onClick={() =>
                  setActiveTab(
                    key as
                      | "meta"
                      | "values"
                      | "errors"
                      | "dirty"
                      | "touched"
                      | "defaults",
                  )
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {activeTab === "meta" && (
              <div className="space-y-2 text-sm">
                <div className="rounded-md border p-3">
                  <div>isDirty: {String(isDirty)}</div>
                  <div>isValid: {String(isValid)}</div>
                  <div>isSubmitting: {String(isSubmitting)}</div>
                  <div>isSubmitted: {String(isSubmitted)}</div>
                  <div>submitCount: {submitCount}</div>
                </div>
              </div>
            )}

            {activeTab === "values" && <JsonBlock value={values} />}
            {activeTab === "errors" && <JsonBlock value={errors} />}
            {activeTab === "dirty" && <JsonBlock value={dirtyFields} />}
            {activeTab === "touched" && <JsonBlock value={touchedFields} />}
            {activeTab === "defaults" && <JsonBlock value={defaultValues} />}
          </div>
        </div>
      )}
    </div>
  );
}
