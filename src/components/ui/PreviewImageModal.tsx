import React from 'react';
import { Dialog, DialogContent } from './dialog';
import { FileDown } from 'lucide-react';

interface PreviewImageModalProps {
  open: boolean;
  src: string | null;
  onClose: () => void;
  title?: string;
}

export function PreviewImageModal({
  open,
  src,
  onClose,
  title,
}: PreviewImageModalProps) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  React.useEffect(() => {
    setImgLoaded(false);
  }, [src]);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-md p-4 flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
          <div className="font-semibold text-base mb-2 text-blue-900">
            {title || 'Preview Bukti Pembayaran'}
          </div>
          <div className="relative w-full flex flex-col items-center min-h-[200px]">
            {src && (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded border mb-4 min-h-[200px] w-full">
                    <span className="text-gray-400 animate-pulse">
                      Memuat gambar...
                    </span>
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Bukti Pembayaran"
                  className={`max-h-[70vh] max-w-full rounded border shadow-lg mb-4    transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  style={{ display: imgLoaded ? 'block' : 'none' }}
                />
              </>
            )}
          </div>
          <div className="flex flex-row gap-4 justify-center w-full mb-1">
            <a
              href={src || undefined}
              download
              className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              target="_blank"
              rel="noopener noreferrer"
              title="Download"
            >
              <FileDown className="w-6 h-6" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
