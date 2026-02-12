"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

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
import {
  CONFIG_INVALID_AFTER_MAPPING,
  useCreateInbound,
} from "../../model/inbound-create.command";
import { CreateInboundFormBaseFields } from "./CreateInboundFormBaseFields";
import { CreateInboundFormHy2Fields } from "./CreateInboundFormHy2Fields";
import { CreateInboundFormVlessFields } from "./CreateInboundFormVlessFields";

export const CREATE_INBOUND_FORM_ID = "create-inbound-form";

const typeItems = [
  { label: "VLESS", value: "vless" },
  { label: "Hysteria2", value: "hysteria2" },
] satisfies ReadonlyArray<{
  label: string;
  value: CreateInboundFormValues["type"];
}>;

const defaultsByType = {
  vless: {
    type: "vless",

    // Base
    tag: "",
    listen_port: 443,
    reality_handshake_port: 443,
    sniff: true,
    sniff_override_destination: true,

    // VLESS
    user_name: "",
    uuid: "",
    flow: "",
    tls_server_name: "www.cloudflare.com",
    reality_handshake_server: "www.cloudflare.com",
    reality_private_key: "",
  },
  hysteria2: {
    type: "hysteria2",

    // Base
    tag: "",
    listen_port: 443,
    reality_handshake_port: 443,
    sniff: true,
    sniff_override_destination: true,

    // Hy2
    user_name: "",
    password: "",
    up_mbps: 100,
    down_mbps: 100,
    obfs_password: "",
    tls_server_name: "www.cloudflare.com",
    certificate_path: "/etc/sing-box/hy2.crt",
    key_path: "/etc/sing-box/hy2.key",
  },
} satisfies Record<CreateInboundFormValues["type"], CreateInboundFormValues>;

export function CreateInboundForm() {
  const { createInbound } = useCreateInbound();

  const form = useForm<CreateInboundFormValues>({
    resolver: zodResolver(CreateInboundFormSchema),
    mode: "onSubmit",
    defaultValues: defaultsByType["vless"],
  });

  const type = useWatch({
    control: form.control,
    name: "type",
  });

  const prevTypeRef = useRef(type);

  useEffect(() => {
    const prev = prevTypeRef.current;
    if (prev === type) return;

    form.reset(defaultsByType[type]);
    prevTypeRef.current = type;
  }, [type, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createInbound(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      if (msg === CONFIG_INVALID_AFTER_MAPPING) {
        toast.error("Конфиг получился невалидным (баг маппера).");
        return;
      }

      toast.error("Не удалось создать инбаунд");
    }
  });

  return (
    <div className="w-full">
      <div className="w-full">
        <FormProvider {...form}>
          <form id={CREATE_INBOUND_FORM_ID} onSubmit={onSubmit}>
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
