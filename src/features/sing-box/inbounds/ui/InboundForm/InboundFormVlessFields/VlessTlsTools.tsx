import { Wand2 } from "lucide-react";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { cn } from "@/shared/lib";
import { Button, UncontrolledTextField } from "@/shared/ui";

interface VlessTlsToolsProps {
  disabled?: boolean;
  onGenerate: () => void;
  loading?: boolean;
  error?: string;
}

export function VlessTlsTools({
  disabled = false,
  loading,
  onGenerate,
  error,
}: VlessTlsToolsProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-lg border p-4",
        disabled && "opacity-70",
      )}
    >
      <UncontrolledTextField<InboundFormValues>
        disabled={true}
        errorMessage={false}
        label="Reality private key"
        name="reality_private_key"
        placeholder="private_key"
      />
      <UncontrolledTextField<InboundFormValues>
        disabled={true}
        errorMessage={false}
        label="Reality public key"
        name="_reality_public_key"
        placeholder="public_key"
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
