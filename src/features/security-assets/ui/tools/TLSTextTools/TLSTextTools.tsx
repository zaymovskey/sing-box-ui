import { Wand2 } from "lucide-react";

import { cn } from "@/shared/lib";
import { Button, UncontrolledTextField } from "@/shared/ui";

import { type SecurityAssetFormValues } from "../../../model/security-asset-form.schema";

interface RealityToolsProps {
  disabled?: boolean;
  onGenerate: () => void;
  loading?: boolean;
  error?: string;
}

export function TLSTextTools({
  disabled = false,
  loading,
  onGenerate,
  error,
}: RealityToolsProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-lg border p-4",
        disabled && "opacity-70",
      )}
    >
      <UncontrolledTextField<SecurityAssetFormValues>
        disabled={true}
        errorMessage={false}
        label="Certificate"
        name="source.certificatePem"
        placeholder="certificatePem"
      />
      <UncontrolledTextField<SecurityAssetFormValues>
        disabled={true}
        errorMessage={false}
        label="Key"
        name="source.keyPem"
        placeholder="keyPem"
      />
      {error && (
        <div className="border-destructive-foreground/40 bg-destructive-foreground/5 mt-2 rounded-md border px-3 py-2">
          <p className="text-destructive-foreground text-sm font-medium">
            {error}
          </p>
        </div>
      )}
      <div className="flex justify-end">
        <Button
          disabled={disabled}
          loading={loading}
          type="button"
          onClick={onGenerate}
        >
          <Wand2 />
          Сгенерировать
        </Button>
      </div>
    </div>
  );
}
