import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Home } from 'lucide-react';
import { BLOK_LIST } from '@/constants';

interface BlockHouseNumberSelectorProps {
  blockValue: string;
  houseNumberValue: string;
  onBlockChange: (value: string) => void;
  onHouseNumberChange: (value: string) => void;
  blockError?: string;
  houseNumberError?: string;
  maxHouseNumber?: number;
  disabled?: boolean;
}

/**
 * Common component untuk memilih Blok dan Nomor Rumah
 */
export function BlockHouseNumberSelector({
  blockValue,
  houseNumberValue,
  onBlockChange,
  onHouseNumberChange,
  blockError,
  houseNumberError,
  maxHouseNumber = 50,
  disabled = false,
}: BlockHouseNumberSelectorProps) {
  const houseNumbers = Array.from({ length: maxHouseNumber }, (_, i) =>
    String(i + 1),
  );

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs flex items-center gap-1 mb-0 font-semibold text-blue-900">
        <Home className="w-4 h-4" />
        Blok & Nomor Rumah
      </Label>
      <div className="flex gap-3">
        <div className="flex-1">
          <Select
            value={blockValue}
            onValueChange={onBlockChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Blok" />
            </SelectTrigger>
            <SelectContent>
              {BLOK_LIST.map((blok) => (
                <SelectItem key={blok} value={blok}>
                  {blok}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {blockError && (
            <span className="text-red-500 text-xs">{blockError}</span>
          )}
        </div>
        <div className="flex-1">
          <Select
            value={houseNumberValue}
            onValueChange={onHouseNumberChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Nomor" />
            </SelectTrigger>
            <SelectContent>
              {houseNumbers.map((no) => (
                <SelectItem key={no} value={no}>
                  {no}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {houseNumberError && (
            <span className="text-red-500 text-xs">{houseNumberError}</span>
          )}
        </div>
      </div>
    </div>
  );
}
