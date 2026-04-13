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
  { label: "Отключен", value: "disabled" },
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
    <div className="space-y-4">
      <ControlledSelectField<InboundFormValues>
        className="mb-1"
        items={transportTypeOptions}
        label="Транспорт"
        name="transport.type"
        placeholder="Выберите транспорт VLESS"
        showErrorMessage={false}
      />

      <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
        <p className="text-muted-foreground">
          В большинстве случаев транспорт не нужен. Используйте его только если
          клиент и сервер действительно должны работать через `ws`, `grpc`,
          `http`, `httpupgrade` или `quic`.
        </p>
      </div>

      {transportType === "grpc" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField<InboundFormValues>
            label="Service name"
            name="transport.service_name"
            placeholder="my-grpc-service"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Idle timeout"
            name="transport.idle_timeout"
            placeholder="15s"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Ping timeout"
            name="transport.ping_timeout"
            placeholder="15s"
          />
          <ControlledSwitchField<InboundFormValues>
            className="h-fit"
            label="Permit without stream"
            name="transport.permit_without_stream"
            placeholder="Разрешить HTTP/2 PING без активных стримов"
          />
        </div>
      )}

      {transportType === "http" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField<InboundFormValues>
            label="Host"
            name="transport.host"
            placeholder="example.com, cdn.example.com"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Path"
            name="transport.path"
            placeholder="/vless-http"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Method"
            name="transport.method"
            placeholder="PUT"
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
            placeholder="15s"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Ping timeout"
            name="transport.ping_timeout"
            placeholder="15s"
          />
        </div>
      )}

      {transportType === "ws" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField<InboundFormValues>
            label="Path"
            name="transport.path"
            placeholder="/ws"
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
            placeholder="2048"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Early data header name"
            name="transport.early_data_header_name"
            placeholder="Sec-WebSocket-Protocol"
          />
        </div>
      )}

      {transportType === "httpupgrade" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField<InboundFormValues>
            label="Host"
            name="transport.host"
            placeholder="example.com"
          />
          <UncontrolledTextField<InboundFormValues>
            label="Path"
            name="transport.path"
            placeholder="/upgrade"
          />
          <UncontrolledTextareaField<InboundFormValues>
            label="Headers"
            name="transport.headers"
            placeholder='{"Host":"example.com"}'
            rows={4}
          />
        </div>
      )}

      {transportType === "quic" && (
        <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
          <p className="text-muted-foreground">
            Для `quic` дополнительных полей не требуется. Достаточно выбрать
            этот тип транспорта.
          </p>
        </div>
      )}
    </div>
  );
}
