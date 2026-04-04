"use client";

import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";

import {
  ControlledSelectField,
  SectionTitle,
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
  mode?: "create" | "edit";
  initialValues?: SecurityAssetFormValues;
};

export function SecurityAssetForm({
  formId,
  form,
  onSubmit,
  mode = "create",
  initialValues,
}: SecurityAssetFormProps) {
  const effectiveInitialValues = initialValues ?? defaultsByType.tls();

  const watchedType = useWatch({
    control: form.control,
    name: "type",
    defaultValue: effectiveInitialValues.type,
  });

  const tlsInitialValues =
    effectiveInitialValues.type === "tls" ? effectiveInitialValues : null;

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
            disabled={mode === "edit"}
            items={typeItems}
            label="Тип"
            name="type"
            placeholder="Выбери тип"
            showErrorMessage={false}
            onValueChangeExternal={(nextType) => {
              const nextTypeCasted =
                nextType as SecurityAssetFormValues["type"];

              form.reset({
                ...defaultsByType[nextTypeCasted](),
              });
            }}
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
              watchedType === "tls"
                ? "Настройте источник сертификата и ключа для TLS."
                : "Настройте параметры Reality, handshake и сгенерируйте ключевую пару."
            }
            title={
              watchedType === "tls" ? "TLS настройки" : "Reality настройки"
            }
          />

          {watchedType === "tls" && tlsInitialValues && (
            <SecurityAssetFormTlsFields initialValues={tlsInitialValues} />
          )}

          {watchedType === "reality" && <SecurityAssetFormRealityFields />}
        </section>
      </form>
    </FormProvider>
  );
}
