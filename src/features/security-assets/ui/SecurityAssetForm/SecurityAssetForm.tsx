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
import { TLSTextToolsSection } from "../tools/TLSTextTools/TLSTextToolsSection";
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
        <ControlledSelectField
          items={typeItems}
          label="Тип"
          name="type"
          placeholder="Выбери тип"
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField label="Name" name="name" placeholder="name" />
          <UncontrolledTextField
            label="Server Name"
            name="serverName"
            placeholder="server_name"
          />
        </div>

        <div className="mt-6 mb-2 text-xl font-medium opacity-80">
          {type === "tls" && "TLS"}
          {type === "reality" && "Reality"}
        </div>

        <Separator className="mb-4" />

        {type === "tls" && (
          <>
            <ControlledSelectField
              items={[
                { label: "Inline", value: "inline" },
                { label: "File", value: "file" },
              ]}
              label="Certificate Source"
              name="source.sourceType"
              placeholder="Выбери источник сертификата"
            />

            {sourceType === "inline" && <TLSTextToolsSection />}

            {sourceType === "file" && <TLSFileToolsSection />}
          </>
        )}

        {type === "reality" && <RealityToolsSection />}
      </form>
    </FormProvider>
  );
}
