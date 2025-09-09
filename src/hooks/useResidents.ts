import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Resident {
  id: string;
  userId: string;
  block: string;
  houseNumber: string;
  name: string;
}

export function useResidents() {
  return useQuery<Resident[]>({
    queryKey: ['residents'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'residents'));
      // Map old keys to new keys for backward compatibility (if needed)
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId,
          block: data.block ?? data.blokRumah,
          houseNumber: data.houseNumber ?? data.nomorRumah,
          name: data.name ?? data.nama,
        } as Resident;
      });
    },
  });
}

export function useAddResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Resident, 'id'>) => {
      await addDoc(collection(db, 'residents'), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}

export function useEditResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Resident) => {
      const { id, ...fields } = data;
      await updateDoc(doc(db, 'residents', id), fields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}

export function useDeleteResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'residents', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}
