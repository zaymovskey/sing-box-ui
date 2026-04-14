import { type UseFormReturn } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { Card } from "@/shared/ui";

import { InboundFormProvider } from "../../model/inbound-form-ui.context";
import { InboundForm } from "../InboundForm/InboundForm";

export function InboundDetailsFormSection({
  form,
  formId,
  initialValues,
  onSubmit,
}: {
  form: UseFormReturn<InboundFormValues>;
  formId: string;
  initialValues: InboundFormValues;
  onSubmit: (values: InboundFormValues) => Promise<void>;
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="mx-auto max-w-3xl px-6 py-6">
        <InboundFormProvider contextValue={{ mode: "edit", initialValues }}>
          <InboundForm
            form={form}
            formId={formId}
            initialValues={initialValues}
            onSubmit={onSubmit}
          />
        </InboundFormProvider>
      </div>
    </Card>
  );
}
