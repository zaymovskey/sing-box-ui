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

export function TLSInlineTools({
  disabled = false,
  loading,
  onGenerate,
  error,
}: RealityToolsProps) {
  return (
    <div
      className={cn(
        "bg-muted/20 space-y-4 rounded-lg border p-4",
        disabled && "opacity-70",
      )}
    >
      <UncontrolledTextField<SecurityAssetFormValues>
        disabled={true}
        label="Сертификат"
        name="source.certificatePem"
        placeholder="Сертификат будет подставлен после генерации"
        showErrorMessage={false}
      />
      <UncontrolledTextField<SecurityAssetFormValues>
        disabled={true}
        label="Ключ"
        name="source.keyPem"
        placeholder="Ключ будет подставлен после генерации"
        showErrorMessage={false}
      />
      {error && (
        <div className="border-destructive-foreground/40 bg-destructive-foreground/5 mt-2 rounded-md border px-3 py-2">
          <p className="text-destructive-foreground text-sm font-medium">
            {error}
          </p>
        </div>
      )}

      <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
        <p className="text-muted-foreground">
          Генератор создаёт самоподписанный TLS-сертификат для указанного
          `serverName` и сразу подставляет сертификат с ключом в форму.
        </p>
      </div>

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
