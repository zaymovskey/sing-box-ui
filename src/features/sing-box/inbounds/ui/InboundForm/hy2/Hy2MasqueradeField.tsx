import { useFormContext, useWatch } from "react-hook-form";

import {
  type Hy2Form,
  type InboundFormValues,
} from "@/features/sing-box/config-core";
import {
  ControlledSwitchField,
  FormLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  UncontrolledNumberField,
  UncontrolledTextareaField,
  UncontrolledTextField,
} from "@/shared/ui";

export function Hy2MasqueradeField() {
  const form = useFormContext<InboundFormValues>();

  const error = form.getFieldState("masquerade", form.formState).error;
  const inputId = "field_masquerade";

  const selectedMasqueradeType = useWatch({
    control: form.control,
    name: "masquerade.type",
  });

  const onMasqueradeTypeChange = (value: Hy2Form["masquerade"]["type"]) => {
    form.setValue("masquerade.type", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: form.formState.submitCount > 0,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <FormLabel
        className={error ? "text-destructive" : undefined}
        htmlFor={inputId}
      >
        Masquerade type
      </FormLabel>

      <Select
        value={selectedMasqueradeType}
        onValueChange={(value) =>
          onMasqueradeTypeChange(value as Hy2Form["masquerade"]["type"])
        }
      >
        <SelectTrigger className="w-full" id={inputId}>
          <SelectValue placeholder="Выберите masquerade" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="disabled">Disabled</SelectItem>
          <SelectItem value="url">URL (simple)</SelectItem>
          <SelectItem value="file_server">File server</SelectItem>
          <SelectItem value="reverse_proxy">Reverse proxy</SelectItem>
          <SelectItem value="fixed_response">Fixed response</SelectItem>
        </SelectContent>
      </Select>

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
