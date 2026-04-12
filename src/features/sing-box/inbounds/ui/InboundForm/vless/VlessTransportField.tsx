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

const transportTypeOptions: SelectFieldItem<string>[] = [
  { label: "Disabled", value: "disabled" },
  { label: "WebSocket", value: "ws" },
  { label: "gRPC", value: "grpc" },
  { label: "HTTP", value: "http" },
  { label: "HTTP Upgrade", value: "httpupgrade" },
  { label: "QUIC", value: "quic" },
];

export function VlessTransportField() {
  const form = useFormContext<Extract<InboundFormValues, { type: "vless" }>>();

  const transportType = useWatch({
    control: form.control,
    name: "transport.type",
  });

  return (
    <div>
      <ControlledSelectField<InboundFormValues>
        className="mb-4"
        items={transportTypeOptions}
        label="Transport type"
        name="transport.type"
        placeholder="Выберите тип транспорта"
        showErrorMessage={false}
      />
      {transportType === "grpc" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField<InboundFormValues>
            label="Service name"
            name="transport.service_name"
            placeholder="Введите service name"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Idle timeout"
            name="transport.idle_timeout"
            placeholder="Введите idle timeout"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Ping timeout"
            name="transport.ping_timeout"
            placeholder="Введите ping timeout"
          />
          <ControlledSwitchField<InboundFormValues>
            label="Permit without stream"
            name="transport.permit_without_stream"
            placeholder="Введите permit without stream"
          />
        </div>
      )}

      {transportType === "http" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField<InboundFormValues>
            label="Host"
            name="transport.host"
            placeholder="Введите host"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Path"
            name="transport.path"
            placeholder="Введите path"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Method"
            name="transport.method"
            placeholder="Введите method"
          />
          <UncontrolledTextareaField<InboundFormValues>
            label="Headers"
            name="transport.headers"
            placeholder='{"Host":"example.com"}'
            rows={4}
          />
          <UncontrolledTextField<InboundFormValues>
            label="Idle timeout"
            name="transport.idle_timeout"
            placeholder="Введите idle timeout"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Ping timeout"
            name="transport.ping_timeout"
            placeholder="Введите ping timeout"
          />
        </div>
      )}

      {transportType === "ws" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField<InboundFormValues>
            label="Path"
            name="transport.path"
            placeholder="Введите path"
          />
          <UncontrolledTextareaField<InboundFormValues>
            label="Headers"
            name="transport.headers"
            placeholder='{"Host":"example.com"}'
            rows={4}
          />
          <UncontrolledNumberField<InboundFormValues>
            label="Max early data"
            name="transport.max_early_data"
            placeholder="Введите max early data"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Early data header name"
            name="transport.early_data_header_name"
            placeholder="Введите early data header name"
          />
        </div>
      )}

      {transportType === "httpupgrade" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField<InboundFormValues>
            label="Host"
            name="transport.host"
            placeholder="Введите host"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Path"
            name="transport.path"
            placeholder="Введите path"
          />
          <UncontrolledTextareaField<InboundFormValues>
            label="Headers"
            name="transport.headers"
            placeholder='{"Host":"example.com"}'
            rows={4}
          />
        </div>
      )}

      {transportType === "quic" && <>{/* Ничего */}</>}
    </div>
  );
}
