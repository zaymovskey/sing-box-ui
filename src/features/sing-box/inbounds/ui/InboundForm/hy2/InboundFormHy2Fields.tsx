"use client";

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
  SubsectionTitle,
  UncontrolledNumberField,
  UncontrolledTextField,
} from "@/shared/ui";

import { Hy2MasqueradeField } from "./Hy2MasqueradeField";

export function InboundFormHy2Fields() {
  const { control, trigger, formState, setValue } =
    useFormContext<InboundFormValues>();

  const { data: securityAssetsList, isPending: securityAssetsListPending } =
    useSecurityAssetsListQuery({
      type: "tls",
    });

  const securityAssetsOptions: SelectFieldItem[] =
    securityAssetsList?.map((asset) => ({
      value: asset.id,
      label: asset.name,
    })) ?? [];

  const bbrProfileOptions: SelectFieldItem[] = [
    { label: "Консервативный", value: "conservative" },
    { label: "Стандартный", value: "standard" },
    { label: "Агрессивный", value: "aggressive" },
  ];

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

  const obfsEnabled = useWatch({
    control,
    name: "obfs_enabled",
    defaultValue: false,
  });

  const ignoreClientBandwidth = useWatch({
    control,
    name: "ignore_client_bandwidth",
    defaultValue: false,
  });

  useEffect(() => {
    if (formState.submitCount === 0) {
      return;
    }

    void trigger("users");
  }, [watchedUsers, formState.submitCount, trigger]);

  useEffect(() => {
    if (obfsEnabled) {
      return;
    }

    setValue("obfs_password", "", {
      shouldDirty: true,
      shouldValidate: formState.submitCount > 0,
    });
  }, [obfsEnabled, setValue, formState.submitCount]);

  useEffect(() => {
    if (!ignoreClientBandwidth) {
      return;
    }

    setValue("up_mbps", 100, {
      shouldDirty: true,
      shouldValidate: formState.submitCount > 0,
    });

    setValue("down_mbps", 100, {
      shouldDirty: true,
      shouldValidate: formState.submitCount > 0,
    });
  }, [ignoreClientBandwidth, setValue, formState.submitCount]);

  const handleAddUser = () => {
    append({
      display_name: "",
      password: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SubsectionTitle
          description="Добавьте пользователей, которым будет разрешено подключение к этому Hysteria2 inbound."
          title="Пользователи"
        />

        <div className="space-y-4">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="bg-muted/20 space-y-4 rounded-lg border p-4"
            >
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
                  label="Имя пользователя"
                  name={`users.${index}.display_name`}
                  placeholder="iPhone, Laptop, Home PC"
                />

                <UncontrolledTextField<InboundFormValues>
                  label="Пароль"
                  name={`users.${index}.password`}
                  placeholder="Секрет для подключения клиента"
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
          description="Укажите ограничения входящей и исходящей скорости для этого inbound."
          title="Скорость"
        />

        <ControlledSwitchField<InboundFormValues>
          label="Игнорировать bandwidth клиента"
          name="ignore_client_bandwidth"
          placeholder="Сервер не будет требовать `up_mbps` и `down_mbps` от клиента"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledNumberField<InboundFormValues>
            disabled={ignoreClientBandwidth}
            label="Upstream (Mbps)"
            name="up_mbps"
            placeholder="100"
          />

          <UncontrolledNumberField<InboundFormValues>
            disabled={ignoreClientBandwidth}
            label="Downstream (Mbps)"
            name="down_mbps"
            placeholder="100"
          />
        </div>

        <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
          <p className="text-muted-foreground">
            Если включить игнорирование bandwidth клиента, sing-box перестанет
            ожидать эти значения от клиента и будет использовать серверные
            настройки по умолчанию.
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SubsectionTitle
          description="Настройки профиля BBR и отладочного режима brutal. В большинстве случаев достаточно оставить стандартный профиль и не включать отладку."
          title="BBR и отладка"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <ControlledSelectField<InboundFormValues>
            items={bbrProfileOptions}
            label="Профиль BBR"
            name="bbr_profile"
            placeholder="Выберите профиль BBR"
          />

          <ControlledSwitchField<InboundFormValues>
            className="h-fit"
            label="Отладка brutal"
            name="brutal_debug"
            placeholder="Включить подробный лог/отладку для brutal-режима"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SubsectionTitle
          description="Дополнительная маскировка трафика. Обычно используется только если это действительно нужно вашему сценарию."
          title="Обфускация"
        />

        <ControlledSwitchField<InboundFormValues>
          label="Включить obfs"
          name="obfs_enabled"
          placeholder="Использовать salamander obfuscation для клиентов Hysteria2"
        />

        <UncontrolledTextField<InboundFormValues>
          disabled={!obfsEnabled}
          label="Пароль obfs"
          name="obfs_password"
          placeholder="Общий пароль для obfuscation"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <SubsectionTitle
          description="Что отвечать по HTTP/3, если клиент не прошёл аутентификацию (маскировка под обычный сервис)."
          title="Маскировка"
        />

        <Hy2MasqueradeField />
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
          placeholder="Выберите asset с сертификатом и ключом"
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
