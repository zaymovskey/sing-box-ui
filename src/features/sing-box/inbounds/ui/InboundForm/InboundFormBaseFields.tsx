import { type InboundFormValues } from "@/features/sing-box/config-core";
import {
  ControlledSwitchField,
  Separator,
  SubsectionTitle,
  UncontrolledTextField,
} from "@/shared/ui";

import { FirewallListenPortChanger } from "./FirewallListenPortChanger";
import { InboundFormListenField } from "./InboundFormListenField";

export function InboundFormBaseFields() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SubsectionTitle
          description="Базовые настройки тега, адреса прослушивания и порта."
          title="Сетевые параметры"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <UncontrolledTextField<InboundFormValues>
              label="Tag"
              name="display_tag"
              placeholder="in-01"
            />

            <InboundFormListenField />
          </div>

          <FirewallListenPortChanger />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SubsectionTitle
          description="Определение протокола и подмена destination по распознанным данным."
          title="Sniffing"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <ControlledSwitchField<InboundFormValues>
            label="Sniff"
            name="sniff"
            placeholder="Автоопределение протокола / домена"
          />

          <ControlledSwitchField<InboundFormValues>
            label="Override destination"
            name="sniff_override_destination"
            placeholder="Подменять destination по sniff"
          />
        </div>
      </div>
    </div>
  );
}
