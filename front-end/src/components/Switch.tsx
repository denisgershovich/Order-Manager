import { type FC } from "react";

import { Switch as ShadcnSwitch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
interface SwitchProps {
  onToggle: (checked: boolean) => void;
  label?: string;
  isChecked: boolean;
}

const Switch: FC<SwitchProps> = ({ onToggle, label, isChecked }) => {
  return (
    <div className="flex items-center space-x-2">
      <ShadcnSwitch id="switchCheck" onCheckedChange={onToggle} checked={isChecked} />

      {!!label && (
        <Label htmlFor="switchCheck"> {label}</Label>
      )}
    </div>
  );
};

export default Switch;
