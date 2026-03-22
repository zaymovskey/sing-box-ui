import { Wand2 } from "lucide-react";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { cn } from "@/shared/lib";
import {
  Button,
  FormItem,
  FormLabel,
  Input,
  UncontrolledTextField,
} from "@/shared/ui";

interface VlessTlsToolsProps {
  disabled?: boolean;
}

export function VlessTlsTools({ disabled = false }: VlessTlsToolsProps) {
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
      <FormItem className="gap-2">
        <FormLabel>Reality public key</FormLabel>
        <Input disabled placeholder="public_key" />
      </FormItem>
      <div className="flex justify-end">
        <Button disabled={disabled}>
          <Wand2 />
          Сгенерировать
        </Button>
      </div>
    </div>
  );
}
