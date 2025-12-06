import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Resident } from './useResidents';
import toast from 'react-hot-toast';
import { GeneratedContent } from './useGenerateContentMutation';

interface PublishAdVariables {
  itemName: string;
  price: number;
  resident: Resident;
  imageUrl: string;
  marketingContent: GeneratedContent;
}

export function usePublishAdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: PublishAdVariables) => {
      const { itemName, price, resident, imageUrl, marketingContent } =
        variables;

      try {
        await addDoc(collection(db, 'ads'), {
          ...marketingContent,
          itemName,
          price,
          imageUrl,
          residentId: resident.id,
          residentName: resident.name,
          block: resident.block,
          houseNumber: resident.houseNumber,
          createdAt: serverTimestamp(),
          residential_id: resident.residential_id,
        });
      } catch (error) {
        console.error('Error in publishAd mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast.success('Iklan berhasil dipublikasikan!');
    },
    onError: (error: Error) => {
      console.error('Publish Ad Error:', error);
      toast.error('Gagal mempublikasikan iklan. Coba lagi nanti.');
    },
  });
}
