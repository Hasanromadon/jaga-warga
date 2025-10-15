import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
  Query,
  CollectionReference,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { extractKeywords } from "../utils/extractKeywords";

export interface Resident {
  id: string;
  block: string;
  houseNumber: string;
  name: string;
  phoneNumber?: string;
  residential_id?: string;
}

export function useResidents(residentialId?: string, search?: string) {
  return useQuery<Resident[]>({
    queryKey: ["residents", residentialId, search],
    queryFn: async () => {
      let q: Query | CollectionReference = collection(db, "residents");
      if (residentialId && search) {
        q = query(
          q,
          where("residential_id", "==", residentialId),
          where("keywords", "array-contains", search.toLowerCase())
        );
      } else if (residentialId) {
        q = query(q, where("residential_id", "==", residentialId));
      } else if (search) {
        q = query(q, where("keywords", "array-contains", search.toLowerCase()));
      }
      const snap = await getDocs(q);
      // Map old keys to new keys for backward compatibility (if needed)
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          block: data.block ?? data.blokRumah,
          houseNumber: data.houseNumber ?? data.nomorRumah,
          name: data.name ?? data.nama,
          phoneNumber: data.phoneNumber,
          residential_id: data.residential_id ?? null,
        } as Resident;
      });
    },
  });
}

export function useAddResident(residentialId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Resident, "id">) => {
      const id = `${data.block}_${data.houseNumber}`;
      const keywords = extractKeywords(data);
      await setDoc(doc(db, "residents", id), { ...data, keywords, residential_id: residentialId ?? data.residential_id ?? null });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });
}

export function useEditResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Resident) => {
      const { id, ...fields } = data;
      const keywords = extractKeywords(fields);
      await updateDoc(doc(db, "residents", id), { ...fields, keywords });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });
}

export function useDeleteResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "residents", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });
}
