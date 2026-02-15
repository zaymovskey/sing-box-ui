import { UncontrolledTextField, UncontrolledUuidField } from "@/shared/ui";

import { type InboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";

export function InboundFormVlessFields() {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          label="User name"
          name="user_name"
          placeholder="user"
        />

        <UncontrolledUuidField<InboundFormValues>
          label="UUID"
          name="uuid"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          label="Flow (optional)"
          name="flow"
          placeholder="xtls-rprx-vision"
        />

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
