"use client";

import { useEffect, useRef } from "react";
import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";

import { generateShortId } from "@/shared/lib";
import {
  ControlledSelectField,
  Separator,
  UncontrolledInputWithGenerateField,
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

function SubsectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium">{title}</h4>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
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
                : "Настройте параметры Reality и сгенерируйте ключевую пару."
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

          {type === "reality" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <SubsectionTitle
                  description="Эти параметры используются клиентом для Reality-подключения."
                  title="Параметры подключения"
                />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <UncontrolledInputWithGenerateField<SecurityAssetFormValues>
                    generateFunction={() => generateShortId()}
                    label="Short ID"
                    name="shortId"
                    placeholder="a1b2c3d4"
                  />

                  <ControlledSelectField<SecurityAssetFormValues>
                    items={[
                      { label: "Chrome", value: "chrome" },
                      { label: "Firefox", value: "firefox" },
                      { label: "Safari", value: "safari" },
                      { label: "Edge", value: "edge" },
                      { label: "Random", value: "random" },
                    ]}
                    label="Fingerprint"
                    name="fingerprint"
                    placeholder="Выберите fingerprint"
                  />

                  <div className="md:col-span-2">
                    <UncontrolledTextField<SecurityAssetFormValues>
                      label="Spider X"
                      name="spiderX"
                      placeholder="/"
                    />
                  </div>
                </div>

                <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
                  <p className="text-foreground font-medium">
                    Как это работает
                  </p>

                  <p className="text-muted-foreground mt-1">
                    Short ID, fingerprint и spiderX используются клиентом при
                    подключении по Reality. Обычно достаточно короткого Short ID
                    и fingerprint со значением chrome.
                  </p>
                </div>
              </div>

              <Separator />

              <RealityToolsSection />
            </div>
          )}
        </section>
      </form>
    </FormProvider>
  );
}
