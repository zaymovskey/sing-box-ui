"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { applyFormApiError } from "@/shared/lib";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/shared/ui";

import {
  CreateInboundFormSchema,
  type CreateInboundFormValues,
} from "../../../config-core/model/config-core.inbounds-schema";
import { CreateInboundFormHy2Fields } from "./CreateInboundFormHy2Fields";
import { CreateInboundFormVlessFields } from "./CreateInboundFormVlessFields";

// TODO: подставь свой use-case / mutation
// import { useCreateInboundMutation } from "../model/create-inbound.mutation";

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

  const typeItems = [
    { label: "VLESS", value: "vless" },
    { label: "Hysteria2", value: "hysteria2" },
  ] satisfies ReadonlyArray<{
    label: string;
    value: CreateInboundFormValues["type"];
  }>;

  return (
    <div className="w-full">
      <div className="w-ful">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            {/* TYPE */}
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

            {/* BASE */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem className="gap-2">
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="in-01"
                        onChange={(e) => {
                          form.clearErrors("root");
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <div className="min-h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="listen_port"
                render={({ field }) => (
                  <FormItem className="gap-2">
                    <FormLabel>Listen port</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="8443"
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          form.clearErrors("root");
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          );
                        }}
                      />
                    </FormControl>
                    <div className="min-h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reality_handshake_port"
                render={() => {
                  const reg = form.register("reality_handshake_port", {
                    valueAsNumber: true,
                  });

                  return (
                    <FormItem className="gap-2">
                      <FormLabel>Handshake port</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="443"
                          type="number"
                          {...reg}
                          onChange={(e) => {
                            form.clearErrors("root");
                            reg.onChange(e);
                          }}
                        />
                      </FormControl>
                      <div className="min-h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sniff"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div className="space-y-1">
                      <FormLabel className="m-0">Sniff</FormLabel>
                      <div className="text-muted-foreground text-xs">
                        Автодетект протокола/домена
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={(v) => {
                          form.clearErrors("root");
                          field.onChange(v);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sniff_override_destination"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div className="space-y-1">
                      <FormLabel className="m-0">
                        Override destination
                      </FormLabel>
                      <div className="text-muted-foreground text-xs">
                        Подменять destination по sniff
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={(v) => {
                          form.clearErrors("root");
                          field.onChange(v);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {type === "vless" ? (
              <CreateInboundFormVlessFields form={form} />
            ) : null}

            {/* HYSTERIA2 */}
            {type === "hysteria2" ? (
              <CreateInboundFormHy2Fields form={form} />
            ) : null}
          </form>
        </Form>
      </div>
    </div>
  );
}
