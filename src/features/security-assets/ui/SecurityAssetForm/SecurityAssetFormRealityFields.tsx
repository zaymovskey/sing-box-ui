import { generateShortId } from "@/shared/lib";
import {
  ControlledSelectField,
  Separator,
  SubsectionTitle,
  UncontrolledInputWithGenerateField,
  UncontrolledTextField,
} from "@/shared/ui";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { RealityToolsSection } from "../tools/RealityTools/RealityToolsSection";

export function SecurityAssetFormRealityFields() {
  return (
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
          <p className="text-foreground font-medium">Как это работает</p>

          <p className="text-muted-foreground mt-1">
            Short ID, fingerprint и spiderX используются клиентом при
            подключении по Reality. Обычно достаточно короткого Short ID и
            fingerprint со значением chrome.
          </p>
        </div>
      </div>

      <Separator />

      <RealityToolsSection />
    </div>
  );
}
