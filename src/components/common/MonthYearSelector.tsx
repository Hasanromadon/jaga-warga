import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { BULAN_LIST, TAHUN_LIST } from '@/constants';

interface MonthYearSelectorProps {
  monthValue: string;
  yearValue: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  monthError?: string;
  yearError?: string;
  disabled?: boolean;
  label?: string;
}

/**
 * Common component untuk memilih Bulan dan Tahun
 */
export function MonthYearSelector({
  monthValue,
  yearValue,
  onMonthChange,
  onYearChange,
  monthError,
  yearError,
  disabled = false,
  label = 'Bulan & Tahun',
}: MonthYearSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs flex items-center gap-1 mb-0 font-semibold text-blue-900">
        <Calendar className="w-4 h-4" />
        {label}
      </Label>
      <div className="flex gap-3">
        <div className="flex-1">
          <Select
            value={monthValue}
            onValueChange={onMonthChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              {BULAN_LIST.map((bulan) => (
                <SelectItem key={bulan.value} value={bulan.value}>
                  {bulan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {monthError && (
            <span className="text-red-500 text-xs">{monthError}</span>
          )}
        </div>
        <div className="flex-1">
          <Select
            value={yearValue}
            onValueChange={onYearChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {TAHUN_LIST.map((tahun) => (
                <SelectItem key={tahun} value={tahun}>
                  {tahun}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {yearError && (
            <span className="text-red-500 text-xs">{yearError}</span>
          )}
        </div>
      </div>
    </div>
  );
}
