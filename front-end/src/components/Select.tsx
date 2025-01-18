import clsx from "clsx";
import * as  ShadcnSelect from "@/components/ui/select";
import { Label } from "@/components/ui/label"
interface SelectProps<T> {
  id: string;
  options: [key: string, value: T][];
  value: T;
  onChange: (value: T) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

const Select = <T extends string>({
  id,
  options,
  value,
  onChange,
  label,
  disabled,
  className
}: SelectProps<T>) => {
  return (
    <div className={clsx("flex items-center space-x-2", className)}>
      {!!label && (
        <Label htmlFor={id}>{label}</Label>
      )}

      <ShadcnSelect.Select name={id} value={value} disabled={disabled} onValueChange={onChange}>
        <ShadcnSelect.SelectTrigger className="w-[180px]">
          <ShadcnSelect.SelectValue />
        </ShadcnSelect.SelectTrigger>

        <ShadcnSelect.SelectContent>
          {options.map(([optionKey, optionValue]) => (
            <ShadcnSelect.SelectItem key={optionKey} value={optionKey} disabled={optionKey === value}>
              {optionValue}
            </ShadcnSelect.SelectItem>
          ))}
        </ShadcnSelect.SelectContent>
      </ShadcnSelect.Select>
    </div>
  );
};

export default Select;
