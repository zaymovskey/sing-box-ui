"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { applyFormApiError } from "@/shared/lib";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

import {
  CreateInboundFormSchema,
  type CreateInboundFormValues,
} from "../../../config-core/model/config-core.inbounds-schema";
import { CreateInboundFormBaseFields } from "./CreateInboundFormBaseFields";
import { CreateInboundFormHy2Fields } from "./CreateInboundFormHy2Fields";
import { CreateInboundFormVlessFields } from "./CreateInboundFormVlessFields";

// TODO: подставь свой use-case / mutation
// import { useCreateInboundMutation } from "../model/create-inbound.mutation";

const typeItems = [
  { label: "VLESS", value: "vless" },
  { label: "Hysteria2", value: "hysteria2" },
] satisfies ReadonlyArray<{
  label: string;
  value: CreateInboundFormValues["type"];
}>;

export function CreateInboundForm() {
  // const createMutation = useCreateInboundMutation();

  const vlessDefaults: CreateInboundFormValues = {
    type: "vless",
    tag: "",
    listen_port: 8443,
    reality_handshake_port: 443,
    sniff: true,
    sniff_override_destination: true,

    user_name: "user",
    uuid: "",
    flow: "",
    tls_server_name: "www.cloudflare.com",
    reality_handshake_server: "www.cloudflare.com",
    reality_private_key: "",
  };

  const form = useForm<CreateInboundFormValues>({
    resolver: zodResolver(CreateInboundFormSchema),
    mode: "onSubmit",
    defaultValues: vlessDefaults,
  });

  const type = useWatch({
    control: form.control,
    name: "type",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      // await createMutation.mutateAsync(data);
      console.log("CREATE INBOUND", data);
    } catch (e) {
      applyFormApiError(form, e, {
        400: "Некорректные данные",
        401: "Нужна авторизация",
        403: "Доступ запрещён",
        409: "Конфликт (возможно, tag уже занят)",
        429: "Слишком много попыток. Попробуй позже.",
        500: "Ошибка сервера",
      });
    }
  });

  return (
    <div className="w-full">
      <div className="w-full">
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
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
                        typeField.onChange(
                          v as CreateInboundFormValues["type"],
                        );
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
      </div>
    </div>
  );
}
