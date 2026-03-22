import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import {
  Button,
  ControlledSwitchField,
  Separator,
  UncontrolledNumberField,
  UncontrolledTextField,
  UncontrolledUuidField,
} from "@/shared/ui";

import { VlessTlsToolsSection } from "./VlessTlsToolsSection";

export function InboundFormVlessFields() {
  const { control, clearErrors, setValue, trigger, formState } =
    useFormContext<InboundFormValues>();

  const {
    fields: users,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "users",
  });

  const tlsEnabled = useWatch({
    control,
    name: "tls_enabled",
  });

  const realityEnabled = useWatch({
    control,
    name: "reality_enabled",
  });

  useEffect(() => {
    if (!tlsEnabled && realityEnabled) {
      setValue("reality_enabled", false, {
        shouldDirty: true,
        shouldValidate: false,
        shouldTouch: false,
      });
    }

    if (!tlsEnabled) {
      clearErrors([
        "tls_server_name",
        "reality_enabled",
        "reality_handshake_server",
        "reality_handshake_server_port",
        "reality_private_key",
      ]);
    }
  }, [tlsEnabled, realityEnabled, clearErrors, setValue]);

  const watchedUsers = useWatch({
    control,
    name: "users",
  });

  useEffect(() => {
    if (formState.submitCount === 0) {
      return;
    }

    void trigger("users");
  }, [watchedUsers, formState.submitCount, trigger]);

  return (
    <>
      <div className="mb-10 space-y-4">
        {users.map((user, index) => (
          <div key={user.id} className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Пользователь {index + 1}</h4>

              <Button
                disabled={users.length === 1}
                size="icon"
                type="button"
                variant="outline"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <UncontrolledTextField<InboundFormValues>
                label="User name"
                name={`users.${index}.name`}
                placeholder="user"
              />

              <UncontrolledUuidField<InboundFormValues>
                label="UUID"
                name={`users.${index}.uuid`}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />

              <UncontrolledTextField<InboundFormValues>
                label="Flow (optional)"
                name={`users.${index}.flow`}
                placeholder="xtls-rprx-vision"
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: "",
              uuid: "",
              flow: "",
            })
          }
        >
          Добавить пользователя
        </Button>
      </div>
      <Separator />
      <ControlledSwitchField<InboundFormValues>
        label="TLS - Transport Layer Security"
        name="tls_enabled"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          disabled={!tlsEnabled}
          label="TLS server name"
          name="tls_server_name"
          placeholder="www.cloudflare.com"
        />
      </div>
      <ControlledSwitchField<InboundFormValues>
        disabled={!tlsEnabled}
        label="Reality"
        name="reality_enabled"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          disabled={!realityEnabled || !tlsEnabled}
          label="Handshake server"
          name="reality_handshake_server"
          placeholder="www.cloudflare.com"
        />
        <UncontrolledNumberField<InboundFormValues>
          disabled={!realityEnabled || !tlsEnabled}
          label="Handshake server port"
          name="reality_handshake_server_port"
          placeholder="443"
        />
      </div>
      <VlessTlsToolsSection />
    </>
  );
}
