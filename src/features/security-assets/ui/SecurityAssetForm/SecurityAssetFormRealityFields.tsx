import { generateShortId } from "@/shared/lib";
import {
  ControlledInputWithSelectField,
  ControlledSelectField,
  type SelectFieldItem,
  Separator,
  SubsectionTitle,
  UncontrolledInputWithGenerateField,
  UncontrolledNumberField,
  UncontrolledTextField,
} from "@/shared/ui";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { RealityToolsSection } from "../tools/RealityTools/RealityToolsSection";

const fingerprintItems = [
  { label: "Chrome", value: "chrome" },
  { label: "Firefox", value: "firefox" },
  { label: "Safari", value: "safari" },
  { label: "Edge", value: "edge" },
  { label: "Random", value: "random" },
];

type DurationUnit = "ms" | "s" | "m" | "h";

const durationOptions: SelectFieldItem<DurationUnit>[] = [
  { value: "ms", label: "ms" },
  { value: "s", label: "s" },
  { value: "m", label: "m" },
  { value: "h", label: "h" },
];

function parseDuration(
  rawValue: string,
  defaultSelectValue: DurationUnit,
): {
  inputValue: string;
  selectValue: DurationUnit;
} {
  const match = rawValue.match(/^(\d+)(ms|s|m|h)$/);

  if (!match) {
    return {
      inputValue: "",
      selectValue: defaultSelectValue,
    };
  }

  return {
    inputValue: match[1],
    selectValue: match[2] as DurationUnit,
  };
}

function formatDuration(
  inputValue: string,
  selectValue: DurationUnit,
): string | undefined {
  if (!inputValue) {
    return undefined;
  }

  return `${inputValue}${selectValue}`;
}

export function SecurityAssetFormRealityFields() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledInputWithGenerateField<SecurityAssetFormValues>
            generateFunction={() => generateShortId()}
            label="Short ID"
            name="shortId"
            placeholder="a1b2c3d4"
          />

          <ControlledSelectField<SecurityAssetFormValues>
            items={fingerprintItems}
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
          <p className="text-foreground font-medium">Подсказка</p>
          <div className="text-muted-foreground mt-1 space-y-1.5">
            <p>
              В большинстве случаев достаточно оставить fingerprint ={" "}
              <span className="text-foreground font-medium">chrome</span>.
            </p>
            <p>
              Short ID должен быть коротким hex-значением, а Spider X обычно
              оставляют равным{" "}
              <span className="text-foreground font-medium">/</span>.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SubsectionTitle
          description="Эти настройки нужны серверной стороне Reality для корректного handshake."
          title="Handshake"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UncontrolledTextField<SecurityAssetFormValues>
            label="Handshake server"
            name="handshakeServer"
            placeholder="www.cloudflare.com"
          />

          <UncontrolledNumberField<SecurityAssetFormValues>
            label="Handshake server port"
            name="handshakeServerPort"
            placeholder="443"
          />

          <div className="md:col-span-2">
            <ControlledInputWithSelectField
              defaultSelectValue="ms"
              formatValue={formatDuration}
              label="Max time difference"
              name="tls.reality.max_time_difference"
              parseValue={parseDuration}
              placeholder="Например, 500"
              selectOptions={durationOptions}
            />
          </div>
        </div>

        <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
          <p className="text-foreground font-medium">Подсказка</p>
          <div className="text-muted-foreground mt-1 space-y-1.5">
            <p>
              Обычно в качестве handshake server используют обычный HTTPS-хост,
              а порт оставляют{" "}
              <span className="text-foreground font-medium">443</span>.
            </p>
            <p>
              Max time difference — необязательное ограничение по расхождению
              времени между клиентом и сервером.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <RealityToolsSection />
    </div>
  );
}
