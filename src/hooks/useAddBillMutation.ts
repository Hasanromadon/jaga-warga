import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AddBillFormInputs } from '../components/AddBillForm';



export function useAddBillMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddBillFormInputs) => {
      await addDoc(collection(db, 'bills'), {
       ...data,
       status: 'unpaid',
        proofUrl: '',
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      // Invalidate or refetch bills list if needed
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
}
