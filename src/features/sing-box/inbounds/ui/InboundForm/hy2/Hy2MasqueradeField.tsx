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
  { label: "Отключена", value: "disabled" },
  { label: "URL (простой режим)", value: "url" },
  { label: "Файловый сервер", value: "file_server" },
  { label: "Reverse proxy", value: "reverse_proxy" },
  { label: "Фиксированный ответ", value: "fixed_response" },
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
    <div className="space-y-4">
      <ControlledSelectField<InboundFormValues>
        items={masqueradeTypeItems}
        label="Режим маскировки"
        name="masquerade.type"
        placeholder="Выберите режим маскировки"
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
          label="Директория"
          name="masquerade.directory"
          placeholder="/var/www/html"
        />
      )}

      {selectedMasqueradeType === "reverse_proxy" && (
        <div className="space-y-4">
          <UncontrolledTextField<InboundFormValues>
            label="Upstream URL"
            name="masquerade.url"
            placeholder="https://example.com"
          />
          <ControlledSwitchField<InboundFormValues>
            label="Rewrite host"
            name="masquerade.rewrite_host"
            placeholder="Подменять заголовок Host на адрес upstream-сервера"
          />
        </div>
      )}

      {selectedMasqueradeType === "fixed_response" && (
        <div className="space-y-4">
          <UncontrolledNumberField<InboundFormValues>
            label="Status code"
            name="masquerade.status_code"
            placeholder="200"
          />
          <UncontrolledTextareaField<InboundFormValues>
            label="Контент"
            name="masquerade.content"
            placeholder="Hello from sing-box"
            rows={4}
          />
          <UncontrolledTextareaField<InboundFormValues>
            label="Headers"
            name="masquerade.headers"
            placeholder='{"Content-Type":"text/plain; charset=utf-8"}'
            rows={4}
          />
        </div>
      )}
    </div>
  );
}
