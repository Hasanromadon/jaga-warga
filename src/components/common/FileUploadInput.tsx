import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { UploadCloud, ImageIcon } from 'lucide-react';

interface FileUploadInputProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

/**
 * Common component untuk upload file dengan drag & drop
 */
export function FileUploadInput({
  value,
  onChange,
  accept = 'image/png, image/jpeg, image/webp',
  maxSizeMB = 2,
  label = 'Upload File',
  description = 'PNG, JPG, WEBP',
  error,
  disabled = false,
  showPreview = true,
}: FileUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);

      // Generate preview for images
      if (showPreview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(file);

      if (showPreview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <Label className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1">
        <ImageIcon className="w-4 h-4" />
        {label}
      </Label>

      {previewUrl && showPreview && (
        <div className="mb-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-40 rounded-md border"
          />
        </div>
      )}

      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors cursor-pointer"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-1 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
              Unggah file
            </span>
            <p className="pl-1">atau tarik dan lepas</p>
          </div>
          <p className="text-xs text-gray-500">
            {description} hingga {maxSizeMB}MB
          </p>
          {value && (
            <p className="text-xs text-blue-600 font-medium">{value.name}</p>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
      />

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
