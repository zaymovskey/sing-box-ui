import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type SelectOption = {
  value: string;
  label: string;
};

interface InputWithSelectProps {
  inputValue: string;
  selectValue: string;
  onInputChange: (value: string) => void;
  onSelectChange: (value: string) => void;
  selectOptions: SelectOption[];
  inputPlaceholder?: string;
  selectPlaceholder?: string;
  inputDisabled?: boolean;
  selectDisabled?: boolean;
}

export function InputWithSelect({
  inputValue,
  selectValue,
  onInputChange,
  onSelectChange,
  selectOptions,
  inputPlaceholder,
  selectPlaceholder = "Select option",
  inputDisabled = false,
  selectDisabled = false,
}: InputWithSelectProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_12rem]">
      <Input
        disabled={inputDisabled}
        placeholder={inputPlaceholder}
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
      />

      <Select
        disabled={selectDisabled}
        value={selectValue}
        onValueChange={onSelectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
