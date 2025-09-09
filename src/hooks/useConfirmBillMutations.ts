import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export function useApproveBillMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ billId }: { billId: string }) => {
      await updateDoc(doc(db, 'bills', billId), {
        status: 'paid',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
}

export function useRejectBillMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ billId, reason }: { billId: string; reason: string }) => {
      await updateDoc(doc(db, 'bills', billId), {
        status: 'rejected',
        rejectReason: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
}
