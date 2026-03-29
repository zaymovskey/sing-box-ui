"use client";

import { useEffect, useRef } from "react";
import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";

import {
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
  Separator,
} from "@/shared/ui";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { defaultsByType, typeItems } from "./SecurityAssetForm.constants";

type SecurityAssetFormProps = {
  formId: string;
  form: UseFormReturn<SecurityAssetFormValues>;
  onSubmit: (values: SecurityAssetFormValues) => Promise<void>;
};

export function SecurityAssetForm({
  formId,
  form,
  onSubmit,
}: SecurityAssetFormProps) {
  const type = useWatch({ control: form.control, name: "type" });
  const sourceType = useWatch({
    control: form.control,
    name: "source.sourceType",
  });

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
        {/* TYPE */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Тип</FormLabel>

              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    form.clearErrors("root");
                    field.onChange(v);
                  }}
                >
                  <SelectTrigger>
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* SERVER NAME */}
        <FormField
          control={form.control}
          name="serverName"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Server Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="mt-6 mb-2 text-xl font-medium opacity-80">
          {type === "tls" && "TLS"}
          {type === "reality" && "Reality"}
        </div>

        <Separator />

        {/* TLS */}
        {type === "tls" && (
          <>
            {/* SOURCE TYPE */}
            <FormField
              control={form.control}
              name="source.sourceType"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Источник сертификата</FormLabel>

                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выбери источник" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="inline">Inline</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* INLINE */}
            {sourceType === "inline" && (
              <>
                <FormField
                  control={form.control}
                  name="source.certificatePem"
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel>Certificate PEM</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source.keyPem"
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel>Private Key</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* FILE */}
            {sourceType === "file" && (
              <>
                <FormField
                  control={form.control}
                  name="source.certificatePath"
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel>Certificate Path</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source.keyPath"
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel>Key Path</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </>
        )}

        {/* REALITY */}
        {type === "reality" && (
          <>
            <FormField
              control={form.control}
              name="privateKey"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Private Key</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortId"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Short ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publicKey"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Public Key (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </FormProvider>
  );
}
