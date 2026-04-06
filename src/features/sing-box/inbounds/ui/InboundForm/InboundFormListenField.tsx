import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import {
  FormLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  UncontrolledTextField,
} from "@/shared/ui";

import { useInboundFormContext } from "../../model/inbound-form-ui.context";

const CUSTOM = "__custom__";
const PRESETS = ["::", "0.0.0.0", "127.0.0.1"] as const;

function isPresetListen(value: string | undefined): boolean {
  return !!value && PRESETS.includes(value as (typeof PRESETS)[number]);
}

function isCustomListen(value: string | undefined): boolean {
  return !!value && !isPresetListen(value);
}

export function InboundFormListenField() {
  const form = useFormContext<InboundFormValues>();
  const { mode, initialValues } = useInboundFormContext();

  const listen = useWatch({
    control: form.control,
    name: "listen",
  });

  const initialListen = initialValues?.listen;

  const [customSelected, setCustomSelected] = useState(() => {
    if (mode === "edit") {
      return isCustomListen(initialListen);
    }

    return false;
  });

  const [lastCustomListen, setLastCustomListen] = useState(() => {
    if (mode === "edit" && isCustomListen(initialListen)) {
      return initialListen;
    }

    return "";
  });

  useEffect(() => {
    if (isCustomListen(listen)) {
      setLastCustomListen(listen);
      setCustomSelected(true);
      return;
    }

    if (isPresetListen(listen)) {
      setCustomSelected(false);
    }
  }, [listen]);

  const onSelectChange = (value: string) => {
    if (value === CUSTOM) {
      setCustomSelected(true);

      form.setValue("listen", lastCustomListen || "", {
        shouldDirty: true,
        shouldTouch: true,
      });

      return;
    }

    setCustomSelected(false);

    form.setValue("listen", value, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const selectValue = customSelected ? CUSTOM : listen || "::";

  const error = form.getFieldState("listen", form.formState).error;
  const inputId = "field_listen";

  return (
    <div className="flex flex-col gap-2">
      <FormLabel
        className={error ? "text-destructive" : undefined}
        htmlFor={inputId}
      >
        Listen
      </FormLabel>

      <Select value={selectValue} onValueChange={onSelectChange}>
        <SelectTrigger className="w-full" id={inputId}>
          <SelectValue placeholder="Выберите listen" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="::">::</SelectItem>
            <SelectItem value="0.0.0.0">0.0.0.0</SelectItem>
            <SelectItem value="127.0.0.1">127.0.0.1</SelectItem>
            <SelectItem value={CUSTOM}>Custom</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {customSelected && (
        <UncontrolledTextField<InboundFormValues>
          name="listen"
          placeholder="192.168.1.10"
        />
      )}
    </div>
  );
}
