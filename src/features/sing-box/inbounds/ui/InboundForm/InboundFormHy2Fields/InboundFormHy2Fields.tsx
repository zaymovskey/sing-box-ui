import { CircleHelp, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { useSecurityAssetsListQuery } from "@/features/security-assets";
import { type InboundFormValues } from "@/features/sing-box/config-core";
import {
  Button,
  ControlledSelectField,
  ControlledSwitchField,
  type SelectFieldItem,
  Separator,
  UncontrolledNumberField,
  UncontrolledTextField,
} from "@/shared/ui";

function SubsectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium">{title}</h4>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
  );
}

export function InboundFormHy2Fields() {
  const { control, trigger, formState } = useFormContext<InboundFormValues>();

  const { data: securityAssetsList, isPending: securityAssetsListPending } =
    useSecurityAssetsListQuery({
      type: "tls",
    });

  const securityAssetsOptions: SelectFieldItem[] =
    securityAssetsList?.map((asset) => ({
      value: asset.id,
      label: asset.name,
    })) ?? [];

  const {
    fields: users,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "users",
  });

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

  const obfsEnabled = useWatch({
    control,
    name: "obfs_enabled",
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SubsectionTitle
          description="Добавьте пользователей, которым будет разрешено подключение к этому Hysteria2 inbound."
          title="Пользователи"
        />

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
      </div>

      <Separator />

      <div className="space-y-4">
        <SubsectionTitle
          description="Укажите ограничения входящей и исходящей скорости для этого inbound."
          title="Скорость"
        />

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
      </div>

      <Separator />

      <div className="space-y-4">
        <SubsectionTitle
          description="Дополнительная маскировка трафика. Обычно используется только если это действительно нужно вашему сценарию."
          title="Obfuscation"
        />

        <ControlledSwitchField<InboundFormValues>
          label="Enable obfs"
          name="obfs_enabled"
        />

        <UncontrolledTextField<InboundFormValues>
          disabled={!obfsEnabled}
          label="Obfs password"
          name="obfs_password"
          placeholder="secret"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <SubsectionTitle
          description="Для Hysteria2 нужно выбрать заранее созданный TLS asset с сертификатом и ключом."
          title="Безопасность"
        />

        <ControlledSelectField<InboundFormValues>
          items={securityAssetsOptions}
          label="TLS asset"
          loading={securityAssetsListPending}
          name="_security_asset_id"
          placeholder="Выберите TLS asset"
        />

        <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
          <div className="flex items-start gap-2">
            <CircleHelp className="text-muted-foreground mt-0.5 size-4 shrink-0" />

            <div className="space-y-1">
              <p className="text-foreground font-medium">Как это работает</p>

              <p className="text-muted-foreground">
                TLS-настройки для Hysteria2 хранятся отдельно в разделе security
                assets. В этой форме вы только привязываете готовый TLS asset к
                inbound.
              </p>

              <p className="text-muted-foreground">
                Если нужного asset ещё нет, сначала создайте его на отдельной
                странице, а потом вернитесь сюда и выберите из списка.
              </p>

              <a
                className="text-primary inline-flex w-fit underline underline-offset-4"
                href="/security-assets"
                rel="noreferrer"
                target="_blank"
              >
                Открыть страницу security assets
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
