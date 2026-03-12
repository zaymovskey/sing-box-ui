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
} from "@/shared/ui";

export function InboundFormHy2Fields() {
  const { control, clearErrors, setValue } =
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

  useEffect(() => {
    if (!tlsEnabled) {
      clearErrors(["certificate_path", "tls_server_name", "key_path"]);
    }
  }, [tlsEnabled, clearErrors, setValue]);

  return (
    <>
      <div className="space-y-4">
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

              <UncontrolledTextField<InboundFormValues>
                label="Password"
                name={`users.${index}.password`}
                placeholder="password"
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
              password: "",
            })
          }
        >
          Добавить пользователя
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledNumberField<InboundFormValues>
          label="Up (Mbps)"
          name="up_mbps"
          placeholder="100"
        />

        <UncontrolledNumberField<InboundFormValues>
          label="Down (Mbps)"
          name="down_mbps"
          placeholder="100"
        />
      </div>
      <UncontrolledTextField<InboundFormValues>
        label="Obfs password (optional)"
        name="obfs_password"
        placeholder="obfs_password"
      />
      <div className="text-l mt-7 mb-2 font-medium opacity-80">
        TLS - Transport Layer Security
      </div>
      <Separator />
      <ControlledSwitchField<InboundFormValues>
        label="TLS"
        name="tls_enabled"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          disabled={!tlsEnabled}
          label="TLS server name"
          name="tls_server_name"
          placeholder="www.cloudflare.com"
        />

        <UncontrolledTextField<InboundFormValues>
          disabled={!tlsEnabled}
          label="Certificate path (.crt)"
          name="certificate_path"
          placeholder="/etc/sing-box/cert.crt"
        />
      </div>
      <UncontrolledTextField<InboundFormValues>
        disabled={!tlsEnabled}
        label="Key path (.key)"
        name="key_path"
        placeholder="/etc/sing-box/private.key"
      />
    </>
  );
}
