"use client";

import { CircleHelp, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { useSecurityAssetsListQuery } from "@/features/security-assets";
import { type InboundFormValues } from "@/features/sing-box/config-core";
import { generateClientUuid } from "@/shared/lib";
import {
  Button,
  ControlledSelectField,
  ControlledSwitchField,
  type SelectFieldItem,
  Separator,
  SubsectionTitle,
  UncontrolledInputWithGenerateField,
  UncontrolledTextField,
} from "@/shared/ui";

const flowOptions: SelectFieldItem[] = [
  {
    label: "xtls-rprx-vision",
    value: "xtls-rprx-vision",
  },
];

export function InboundFormVlessFields() {
  const { control, trigger, formState, setValue } =
    useFormContext<InboundFormValues>();

  const { data: securityAssetsList, isLoading: securityAssetsListLoading } =
    useSecurityAssetsListQuery({
      type: "reality",
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

  const tlsEnabled = useWatch({
    control,
    name: "_tls_enabled",
    defaultValue: false,
  });

  useEffect(() => {
    if (formState.submitCount === 0) {
      return;
    }

    void trigger("users");
  }, [watchedUsers, formState.submitCount, trigger]);

  useEffect(() => {
    if (tlsEnabled) {
      return;
    }

    setValue("_security_asset_id", undefined, {
      shouldDirty: true,
      shouldValidate: formState.submitCount > 0,
    });
  }, [tlsEnabled, setValue, formState.submitCount]);

  const handleAddUser = () => {
    append({
      display_name: "",
      uuid: "",
      flow: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SubsectionTitle
          description="Настройте пользователей, которые смогут подключаться к этому inbound."
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
                  name={`users.${index}.display_name`}
                  placeholder="user"
                />

                <UncontrolledInputWithGenerateField<InboundFormValues>
                  generateFunction={() => generateClientUuid()}
                  label="UUID"
                  name={`users.${index}.uuid`}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />

                <ControlledSelectField<InboundFormValues>
                  items={flowOptions}
                  label="Flow (optional)"
                  name={`users.${index}.flow`}
                  placeholder="Выберите flow"
                />
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={handleAddUser}>
            Добавить пользователя
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SubsectionTitle
          description="Для VLESS с TLS выберите заранее созданный Reality asset."
          title="Безопасность"
        />

        <ControlledSwitchField<InboundFormValues>
          label="Reality enabled"
          name="_tls_enabled"
        />

        <ControlledSelectField<InboundFormValues>
          disabled={!tlsEnabled}
          items={securityAssetsOptions}
          label="Reality asset"
          loading={securityAssetsListLoading}
          name="_security_asset_id"
          placeholder="Выберите Reality asset"
        />

        <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
          <div className="flex items-start gap-2">
            <CircleHelp className="text-muted-foreground mt-0.5 size-4 shrink-0" />

            <div className="space-y-1">
              <p className="text-foreground font-medium">Как это работает</p>

              <p className="text-muted-foreground">
                Reality-конфигурация хранится отдельно как security asset. Здесь
                вы только выбираете уже созданный объект безопасности для этого
                inbound.
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
