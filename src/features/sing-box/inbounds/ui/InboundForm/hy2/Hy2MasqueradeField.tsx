"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import {
  ControlledSelectField,
  ControlledSwitchField,
  type SelectFieldItem,
  UncontrolledNumberField,
  UncontrolledTextareaField,
  UncontrolledTextField,
} from "@/shared/ui";

import { useInboundFormContext } from "../../../model/inbound-form-ui.context";

const masqueradeTypeItems: SelectFieldItem[] = [
  { label: "Disabled", value: "disabled" },
  { label: "URL (simple)", value: "url" },
  { label: "File server", value: "file_server" },
  { label: "Reverse proxy", value: "reverse_proxy" },
  { label: "Fixed response", value: "fixed_response" },
];

export function Hy2MasqueradeField() {
  const form = useFormContext<InboundFormValues>();
  const { initialValues } = useInboundFormContext();

  const watchedMasqueradeType = useWatch({
    control: form.control,
    name: "masquerade.type",
    exact: true,
  });

  const initialMasqueradeType =
    initialValues?.type === "hysteria2"
      ? initialValues.masquerade.type
      : undefined;

  // useWatch на первом кадре после reset часто undefined, а Select уже показывает значение из Controller —
  // иначе условные поля (URL и т.д.) не монтируются при открытии редактирования.
  const selectedMasqueradeType =
    watchedMasqueradeType ??
    form.getValues("masquerade.type") ??
    initialMasqueradeType;

  return (
    <div className="flex flex-col gap-2">
      <ControlledSelectField<InboundFormValues>
        items={masqueradeTypeItems}
        label="Masquerade type"
        name="masquerade.type"
        placeholder="Выберите masquerade"
        onValueChangeExternal={() => {
          form.clearErrors("masquerade");
          if (form.formState.submitCount > 0) {
            void form.trigger("masquerade");
          }
        }}
      />

      {selectedMasqueradeType === "url" && (
        <UncontrolledTextField<InboundFormValues>
          label="URL"
          name="masquerade.url_string"
          placeholder="https://example.com"
        />
      )}

      {selectedMasqueradeType === "file_server" && (
        <UncontrolledTextField<InboundFormValues>
          label="Directory"
          name="masquerade.directory"
          placeholder="/path/to/directory"
        />
      )}

      {selectedMasqueradeType === "reverse_proxy" && (
        <>
          <UncontrolledTextField<InboundFormValues>
            name="masquerade.url"
            placeholder="https://example.com"
          />
          <ControlledSwitchField<InboundFormValues>
            label="Rewrite host"
            name="masquerade.rewrite_host"
          />
        </>
      )}

      {selectedMasqueradeType === "fixed_response" && (
        <>
          <UncontrolledNumberField<InboundFormValues>
            label="Status code"
            name="masquerade.status_code"
            placeholder="200"
          />
          <UncontrolledTextareaField<InboundFormValues>
            label="Content"
            name="masquerade.content"
            placeholder="Content"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Headers"
            name="masquerade.headers"
            placeholder="Headers"
          />
        </>
      )}
    </div>
  );
}
