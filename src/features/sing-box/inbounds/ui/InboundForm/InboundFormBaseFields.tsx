import { type InboundFormValues } from "@/features/sing-box/config-core";
import {
  ControlledSwitchField,
  Separator,
  SubsectionTitle,
  UncontrolledNumberField,
  UncontrolledTextField,
} from "@/shared/ui";

export function InboundFormBaseFields() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SubsectionTitle
          description="Базовые настройки тега, адреса прослушивания и порта."
          title="Сетевые параметры"
        />

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

          <UncontrolledTextField<InboundFormValues>
            label="Listen"
            name="listen"
            placeholder="::"
          />
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
