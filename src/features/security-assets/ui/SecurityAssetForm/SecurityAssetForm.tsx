"use client";

import { useEffect, useRef } from "react";
import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";

import {
  ControlledSelectField,
  Separator,
  UncontrolledTextField,
} from "@/shared/ui";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { defaultsByType, typeItems } from "./SecurityAssetForm.constants";
import { SecurityAssetFormRealityFields } from "./SecurityAssetFormRealityFields";
import { SecurityAssetFormTlsFields } from "./SecurityAssetFormTlsFields";

type SecurityAssetFormProps = {
  formId: string;
  form: UseFormReturn<SecurityAssetFormValues>;
  onSubmit: (values: SecurityAssetFormValues) => Promise<void>;
};

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
      <Separator className="mt-3" />
    </div>
  );
}

export function SecurityAssetForm({
  formId,
  form,
  onSubmit,
}: SecurityAssetFormProps) {
  const type = useWatch({ control: form.control, name: "type" });

  const prevTypeRef = useRef(type);

  useEffect(() => {
    const prev = prevTypeRef.current;

    if (prev === type) return;

    const currentValues = form.getValues();

    form.reset({
      ...defaultsByType[type](),
      id: currentValues.id,
      createdAt: currentValues.createdAt,
    });

    prevTypeRef.current = type;
  }, [type, form]);

  return (
    <FormProvider {...form}>
      <form
        className="space-y-8"
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className="space-y-4">
          <SectionTitle
            description="Выберите тип security asset и заполните его базовые параметры."
            title="Основные настройки"
          />

          <ControlledSelectField<SecurityAssetFormValues>
            items={typeItems}
            label="Тип"
            name="type"
            placeholder="Выбери тип"
            showErrorMessage={false}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <UncontrolledTextField<SecurityAssetFormValues>
              label="Name"
              name="name"
              placeholder="my-security-asset"
            />

            <UncontrolledTextField<SecurityAssetFormValues>
              label="Server Name"
              name="serverName"
              placeholder="www.cloudflare.com"
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle
            description={
              type === "tls"
                ? "Настройте источник сертификата и ключа для TLS."
                : "Настройте параметры Reality, handshake и сгенерируйте ключевую пару."
            }
            title={type === "tls" ? "TLS настройки" : "Reality настройки"}
          />

          {type === "tls" && <SecurityAssetFormTlsFields />}

          {type === "reality" && <SecurityAssetFormRealityFields />}
        </section>
      </form>
    </FormProvider>
  );
}
