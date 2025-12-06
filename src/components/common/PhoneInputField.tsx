import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Common component untuk input nomor telepon dengan format Indonesia
 */
export function PhoneInputField({
  value,
  onChange,
  error,
  label = 'Nomor Telepon',
  placeholder = 'Contoh: 081234567890',
  required = false,
  disabled = false,
}: PhoneInputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya izinkan angka dan +
    const cleaned = e.target.value.replace(/[^\d+]/g, '');
    onChange(cleaned);
  };

  return (
    <div>
      <Label className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1">
        <Phone className="w-4 h-4" />
        {label}
        {!required && (
          <span className="text-gray-400 font-normal">(Opsional)</span>
        )}
      </Label>
      <Input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
      {!error && (
        <p className="text-xs text-gray-500 mt-1">Format: 08xxx atau +628xxx</p>
      )}
    </div>
  );
}
