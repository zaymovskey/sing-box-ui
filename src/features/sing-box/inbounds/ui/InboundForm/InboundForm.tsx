"use client";

import { useEffect, useRef } from "react";
import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/shared/ui";

import { type InboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";
import { defaultsByType, typeItems } from "./InboundForm.constants";
import { InboundFormBaseFields } from "./InboundFormBaseFields";
import { InboundFormHy2Fields } from "./InboundFormHy2Fields";
import { InboundFormVlessFields } from "./InboundFormVlessFields";

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
        <FormField
          control={form.control}
          name="type"
          render={({ field: typeField }) => (
            <FormItem className="gap-2">
              <FormLabel>Тип</FormLabel>

              <FormControl>
                <Select
                  value={typeField.value}
                  onValueChange={(v) => {
                    form.clearErrors("root");
                    typeField.onChange(v);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выбери тип" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {typeItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
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
