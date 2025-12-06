import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface BulkImportProgress {
  current: number;
  total: number;
}

interface BulkImportResult<T> {
  successCount: number;
  errors: string[];
  failedItems: T[];
}

interface UseBulkImportOptions<T> {
  mutationFn: (item: T) => Promise<void>;
  batchSize?: number;
  delayBetweenBatches?: number;
  onProgress?: (progress: BulkImportProgress) => void;
  queryKey?: string[];
}

export function useBulkImport<T>({
  mutationFn,
  batchSize = 10,
  delayBetweenBatches = 100,
  onProgress,
  queryKey,
}: UseBulkImportOptions<T>) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<BulkImportProgress>({
    current: 0,
    total: 0,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async (items: T[]): Promise<BulkImportResult<T>> => {
      setProgress({ current: 0, total: items.length });
      setErrors([]);

      const importErrors: string[] = [];
      const failedItems: T[] = [];
      let successCount = 0;

      try {
        // Process in batches
        for (let i = 0; i < items.length; i += batchSize) {
          const batch = items.slice(i, i + batchSize);

          // Process batch
          await Promise.allSettled(
            batch.map(async (item, batchIndex) => {
              try {
                await mutationFn(item);
                const currentProgress = i + batchIndex + 1;
                setProgress({
                  current: currentProgress,
                  total: items.length,
                });
                onProgress?.({
                  current: currentProgress,
                  total: items.length,
                });
                successCount++;
              } catch (error) {
                const itemIndex = i + batchIndex;
                const errorMsg =
                  error instanceof Error
                    ? error.message
                    : 'Error tidak diketahui';
                importErrors.push(`Item ${itemIndex + 1}: ${errorMsg}`);
                failedItems.push(item);
                throw error;
              }
            }),
          );

          // Delay between batches to prevent rate limiting
          if (i + batchSize < items.length) {
            await new Promise((resolve) =>
              setTimeout(resolve, delayBetweenBatches),
            );
          }
        }

        // Invalidate queries if provided
        if (queryKey) {
          queryClient.invalidateQueries({ queryKey });
        }

        setErrors(importErrors);

        // Show appropriate toast
        if (importErrors.length === 0) {
          toast.success(`✅ Semua ${successCount} item berhasil diimpor!`);
        } else {
          toast.error(
            `${successCount} berhasil, ${importErrors.length} gagal. Lihat detail di bawah.`,
          );
        }

        return {
          successCount,
          errors: importErrors,
          failedItems,
        };
      } catch (error) {
        toast.error('Terjadi kesalahan saat mengimpor data');
        console.error('Bulk import error:', error);
        throw error;
      } finally {
        setProgress({ current: 0, total: 0 });
      }
    },
  });

  const reset = () => {
    setProgress({ current: 0, total: 0 });
    setErrors([]);
  };

  return {
    ...mutation,
    progress,
    errors,
    reset,
  };
}
