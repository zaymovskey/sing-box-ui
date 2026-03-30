"use client";

import { useEffect, useRef } from "react";
import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { ControlledSelectField, Separator } from "@/shared/ui";

import { defaultsByType, typeItems } from "./InboundForm.constants";
import { InboundFormBaseFields } from "./InboundFormBaseFields";
import { InboundFormHy2Fields } from "./InboundFormHy2Fields/InboundFormHy2Fields";
import { InboundFormVlessFields } from "./InboundFormVlessFields/InboundFormVlessFields";

type InboundFormProps = {
  formId: string;
  form: UseFormReturn<InboundFormValues>;
  onSubmit: (values: InboundFormValues) => Promise<void>;
};

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
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <ControlledSelectField<InboundFormValues>
          items={typeItems}
          label="Тип"
          name="type"
          placeholder="Выбери тип"
        />
        <InboundFormBaseFields />

        <div className="space-y-4">
          <div className="mt-7 mb-2 text-xl font-medium opacity-80">
            {type === "vless" && "VLESS"}
            {type === "hysteria2" && "Hysteria2"}
          </div>
          <Separator />

          {type === "vless" && <InboundFormVlessFields />}
          {type === "hysteria2" && <InboundFormHy2Fields />}
        </div>
      </form>
    </FormProvider>
  );
}
