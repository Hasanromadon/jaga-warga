import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AddBillFormInputs } from '../components/AddBillForm';

export function useAddBillMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddBillFormInputs) => {
      await addDoc(collection(db, 'bills'), {
        residentId: data.residentId,
        amount: data.amount,
        month: data.month,
        year: data.year,
        status: 'unpaid',
        proofUrl: '',
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      // Invalidate or refetch bills list if needed
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
}
