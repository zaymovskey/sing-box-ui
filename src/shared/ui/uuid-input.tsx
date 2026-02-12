import { RotateCcw } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";

type UuidInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value"
> & {
  onChange?: (value: string) => void;
};

export function UuidInput({ onChange, ...props }: UuidInputProps) {
  const handleGenerateUuid = () => {
    const uuid = crypto.randomUUID();
    onChange?.(uuid);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="outline" onClick={handleGenerateUuid}>
        <RotateCcw />
      </Button>

      <Input {...props} onChange={handleChange} />
    </div>
  );
}
