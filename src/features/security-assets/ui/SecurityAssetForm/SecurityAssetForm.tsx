"use client";

import { useEffect, useRef } from "react";
import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";

import {
  ControlledSelectField,
  Separator,
  UncontrolledTextField,
} from "@/shared/ui";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { RealityToolsSection } from "../tools/RealityTools/RealityToolsSection";
import { TLSFileToolsSection } from "../tools/TLSFileTools/TLSFileToolsSection";
import { TLSInlineToolsSection } from "../tools/TLSInlineTools/TLSInlineToolsSection";
import { defaultsByType, typeItems } from "./SecurityAssetForm.constants";

type SecurityAssetFormProps = {
  formId: string;
  form: UseFormReturn<SecurityAssetFormValues>;
  onSubmit: (values: SecurityAssetFormValues) => Promise<void>;
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

    form.reset(defaultsByType[type]());
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
            description="Выберите тип security asset и заполните его базовые параметры."
            title="Основные настройки"
          />

          <ControlledSelectField<SecurityAssetFormValues>
            items={typeItems}
            label="Тип"
            name="type"
            placeholder="Выбери тип"
            showErrorMessage={false}
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
              type === "tls"
                ? "Настройте источник сертификата и ключа для TLS."
                : "Настройте ключи и параметры для Reality."
            }
            title={type === "tls" ? "TLS настройки" : "Reality настройки"}
          />

          {type === "tls" && (
            <div className="space-y-4">
              <ControlledSelectField<SecurityAssetFormValues>
                items={[
                  { label: "Inline", value: "inline" },
                  { label: "File", value: "file" },
                ]}
                label="Certificate Source"
                name="source.sourceType"
                placeholder="Выбери источник сертификата"
                showErrorMessage={false}
              />

              <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
                <p className="text-foreground font-medium">
                  Источник TLS сертификата
                </p>

                <p className="text-muted-foreground mt-1">
                  Inline хранит сертификат и ключ прямо в конфигурации. File
                  использует пути к файлам на сервере и подходит, если
                  сертификаты уже лежат в управляемой директории.
                </p>
              </div>

              {sourceType === "inline" && <TLSInlineToolsSection />}
              {sourceType === "file" && <TLSFileToolsSection />}
            </div>
          )}

          {type === "reality" && <RealityToolsSection />}
        </section>
      </form>
    </FormProvider>
  );
}
