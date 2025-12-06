import React from 'react';
import { Label } from '@/components/ui/label';
import { NumberInputWithSeparator } from '@/components/ui/number-input-with-separator';
import { CircleDollarSign } from 'lucide-react';

interface CurrencyInputFieldProps {
  value: number | string;
  onChange: (value: number) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Common component untuk input currency (Rupiah)
 */
export function CurrencyInputField({
  value,
  onChange,
  error,
  label = 'Harga',
  placeholder = 'Contoh: 75000',
  required = true,
  disabled = false,
}: CurrencyInputFieldProps) {
  const handleValueChange = (val: string) => {
    const numValue = parseInt(val, 10);
    onChange(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <div>
      <Label className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1">
        <CircleDollarSign className="w-4 h-4" />
        {label}
        {!required && (
          <span className="text-gray-400 font-normal">(Opsional)</span>
        )}
      </Label>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          Rp
        </span>
        <NumberInputWithSeparator
          value={value}
          onValueChange={handleValueChange}
          placeholder={placeholder}
          className="pl-9"
          disabled={disabled}
        />
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
