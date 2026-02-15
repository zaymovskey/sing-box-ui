import {
  ControlledSwitchField,
  UncontrolledNumberField,
  UncontrolledTextField,
} from "@/shared/ui";

import { type InboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";

export function InboundFormBaseFields() {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UncontrolledTextField<InboundFormValues>
          label="Tag"
          name="tag"
          placeholder="in-01"
        />

        <UncontrolledNumberField<InboundFormValues>
          label="Listen port"
          name="listen_port"
          placeholder="8443"
        />

        <UncontrolledNumberField<InboundFormValues>
          label="Handshake port"
          name="reality_handshake_port"
          placeholder="443"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ControlledSwitchField<InboundFormValues>
          label="Sniff"
          name="sniff"
          placeholder="Автодетект протокола/домена"
        />

        <ControlledSwitchField<InboundFormValues>
          label="Override destination"
          name="sniff_override_destination"
          placeholder="Подменять destination по sniff"
        />
      </div>
    </>
  );
}
