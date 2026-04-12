"use client";

import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { clientEnv } from "@/shared/lib";
import {
  ControlledSelectField,
  FormDebugPanel,
  SectionTitle,
} from "@/shared/ui";

import { useInboundFormContext } from "../../model/inbound-form-ui.context";
import { InboundFormHy2Fields } from "./hy2/InboundFormHy2Fields";
import { defaultsByType, typeItems } from "./InboundForm.constants";
import { InboundFormBaseFields } from "./InboundFormBaseFields";
import { InboundFormVlessFields } from "./vless/InboundFormVlessFields";

type InboundFormProps = {
  formId: string;
  form: UseFormReturn<InboundFormValues>;
  onSubmit: (values: InboundFormValues) => Promise<void>;
  initialValues: InboundFormValues;
};

export function InboundForm({
  formId,
  form,
  onSubmit,
  initialValues,
}: InboundFormProps) {
  const { mode } = useInboundFormContext();

  const type = useWatch({
    control: form.control,
    name: "type",
    defaultValue: initialValues.type,
  });

  const handleTypeChange = (nextType: string) => {
    if (mode === "edit") return;

    const nextInboundType = nextType as InboundFormValues["type"];

    form.clearErrors();
    form.reset(defaultsByType[nextInboundType], {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
      keepSubmitCount: false,
      keepIsSubmitted: false,
    });
  };

  return (
    <FormProvider {...form}>
      <form
        className="space-y-8"
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className="space-y-4">
          <SectionTitle
            description="Выберите тип inbound и заполните базовые сетевые параметры."
            title="Основные настройки"
          />

          <ControlledSelectField<InboundFormValues>
            disabled={mode === "edit"}
            items={typeItems}
            label="Тип inbound"
            name="type"
            placeholder="Выбери тип"
            onValueChangeExternal={handleTypeChange}
          />

          <InboundFormBaseFields />
        </section>

        <section className="space-y-4">
          <SectionTitle
            description={
              type === "vless"
                ? "Настройки пользователей и параметров для VLESS."
                : "Настройки пользователей и лимитов скорости для Hysteria2."
            }
            title={type === "vless" ? "Настройки VLESS" : "Настройки Hysteria2"}
          />

          {type === "vless" && <InboundFormVlessFields />}
          {type === "hysteria2" && <InboundFormHy2Fields />}
        </section>
      </form>

      {clientEnv.NEXT_PUBLIC_NODE_ENV === "development" && (
        <FormDebugPanel form={form} />
      )}
    </FormProvider>
  );
}
