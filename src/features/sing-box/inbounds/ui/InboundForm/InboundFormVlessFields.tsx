import { Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  Button,
  UncontrolledTextField,
  UncontrolledUuidField,
} from "@/shared/ui";

import { type InboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";

export function InboundFormVlessFields() {
  const form = useFormContext<InboundFormValues>();

  const {
    fields: users,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "users",
  });

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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          label="TLS server name"
          name="tls_server_name"
          placeholder="www.cloudflare.com"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          label="Handshake server"
          name="reality_handshake_server"
          placeholder="www.cloudflare.com"
        />
      </div>
      <UncontrolledTextField<InboundFormValues>
        label="Reality private key"
        name="reality_private_key"
        placeholder="private_key"
      />
    </>
  );
}
