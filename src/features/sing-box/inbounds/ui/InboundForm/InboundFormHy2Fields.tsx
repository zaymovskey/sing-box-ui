import { UncontrolledNumberField, UncontrolledTextField } from "@/shared/ui";

import { type InboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";

export function InboundFormHy2Fields() {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          label="User name"
          name="user_name"
          placeholder="user"
        />

        <UncontrolledTextField<InboundFormValues>
          label="Password"
          name="password"
          placeholder="password"
        />
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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          label="TLS server name"
          name="tls_server_name"
          placeholder="www.cloudflare.com"
        />

        <UncontrolledTextField<InboundFormValues>
          label="Certificate path (.crt)"
          name="certificate_path"
          placeholder="/etc/sing-box/cert.crt"
        />
      </div>
      <UncontrolledTextField<InboundFormValues>
        label="Key path (.key)"
        name="key_path"
        placeholder="/etc/sing-box/private.key"
      />
    </>
  );
}
