"use client";

import { useEffect, useRef } from "react";
import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { ControlledSelectField, Separator } from "@/shared/ui";

import { defaultsByType, typeItems } from "./InboundForm.constants";
import { InboundFormBaseFields } from "./InboundFormBaseFields";
import { InboundFormHy2Fields } from "./InboundFormHy2Fields";
import { InboundFormVlessFields } from "./InboundFormVlessFields";

type InboundFormProps = {
  formId: string;
  form: UseFormReturn<InboundFormValues>;
  onSubmit: (values: InboundFormValues) => Promise<void>;
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

export function InboundForm({ formId, form, onSubmit }: InboundFormProps) {
  const type = useWatch({ control: form.control, name: "type" });
  const prevTypeRef = useRef(type);

  useEffect(() => {
    const prev = prevTypeRef.current;

    if (prev === type) return;

    form.reset(defaultsByType[type]);
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
            description="Выберите тип inbound и заполните базовые сетевые параметры."
            title="Основные настройки"
          />

          <ControlledSelectField<InboundFormValues>
            items={typeItems}
            label="Тип inbound"
            name="type"
            placeholder="Выбери тип"
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
    </FormProvider>
  );
}
