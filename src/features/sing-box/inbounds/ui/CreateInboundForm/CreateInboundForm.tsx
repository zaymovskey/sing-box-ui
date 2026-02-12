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
} from "@/shared/ui";

import { type CreateInboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";
import { defaultsByType, typeItems } from "./createInboundForm.constants";
import { CreateInboundFormBaseFields } from "./CreateInboundFormBaseFields";
import { CreateInboundFormHy2Fields } from "./CreateInboundFormHy2Fields";
import { CreateInboundFormVlessFields } from "./CreateInboundFormVlessFields";

type CreateInboundFormProps = {
  formId: string;
  form: UseFormReturn<CreateInboundFormValues>;
  onSubmit: (values: CreateInboundFormValues) => Promise<void>;
};

export function CreateInboundForm({
  formId,
  form,
  onSubmit,
}: CreateInboundFormProps) {
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
                    // ✅ это UX формы (чистим root error, если он был)
                    form.clearErrors("root");

                    typeField.onChange(v as CreateInboundFormValues["type"]);
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

        <CreateInboundFormBaseFields />
        {type === "vless" ? <CreateInboundFormVlessFields /> : null}
        {type === "hysteria2" ? <CreateInboundFormHy2Fields /> : null}
      </form>
    </FormProvider>
  );
}
