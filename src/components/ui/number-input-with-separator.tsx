import React from "react";
import { Input } from "./input";

interface NumberInputWithSeparatorProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | number;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const NumberInputWithSeparator: React.FC<NumberInputWithSeparatorProps> = ({
  value,
  onValueChange,
  label,
  placeholder,
  ...props
}) => {
  // Format value with thousand separator
  const formatValue = (val: string | number) => {
    if (val === undefined || val === null || val === "") return "";
    const num = typeof val === "number" ? val : parseInt(val.toString().replace(/\D/g, ""), 10);
    if (isNaN(num)) return "";
    return num.toLocaleString("id-ID");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const raw = e.target.value.replace(/\D/g, "");
    onValueChange(raw);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-semibold text-blue-900 mb-1">{label}</label>}
      <Input
        type="text"
        inputMode="numeric"
        value={formatValue(value)}
        onChange={handleChange}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
