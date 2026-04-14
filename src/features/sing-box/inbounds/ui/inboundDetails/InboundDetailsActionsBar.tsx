import { type UseFormReturn } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { Button, FormDebugPanel } from "@/shared/ui";

export function InboundDetailsActionsBar({
  form,
  formId,
  isPending,
  onReset,
}: {
  form: UseFormReturn<InboundFormValues>;
  formId: string;
  isPending: boolean;
  onReset: () => void;
}) {
  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/80 fixed right-0 bottom-0 left-0 z-20 border-t backdrop-blur md:left-(--sidebar-width)">
      <div className="flex justify-end gap-2 px-6 py-4">
        {process.env.NODE_ENV === "development" && (
          <FormDebugPanel form={form} />
        )}

        <Button
          disabled={!form.formState.isDirty}
          loading={isPending}
          type="button"
          variant="outline"
          onClick={onReset}
        >
          Сбросить
        </Button>

        <Button
          disabled={!form.formState.isDirty}
          form={formId}
          loading={isPending}
          type="submit"
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
}
