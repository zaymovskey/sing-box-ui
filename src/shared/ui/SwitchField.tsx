import { Switch } from "./switch";

export function SwitchField({
  label,
  placeholder,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  placeholder?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="space-y-1">
        <div className="text-sm font-medium">{label}</div>
        {placeholder && (
          <div className="text-muted-foreground text-xs">{placeholder}</div>
        )}
      </div>

      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
      />
    </div>
  );
}
