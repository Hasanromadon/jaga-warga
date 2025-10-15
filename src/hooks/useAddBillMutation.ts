import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AddBillFormInputs } from "../components/AddBillForm";
import { useAuth } from "./useAuth";
import { extractBillKeywords } from "../utils/extractBillKeywords";
import toast from "react-hot-toast";

export function useAddBillMutation() {
  const queryClient = useQueryClient();
  const { residentialId } = useAuth();
  return useMutation({
    mutationFn: async (data: AddBillFormInputs) => {
      const keywords = extractBillKeywords(
        data as unknown as Record<string, string | null | undefined>
      );
      await addDoc(collection(db, "bills"), {
        ...data,
        residential_id: residentialId,
        status: "unpaid",
        proofUrl: "",
        createdAt: serverTimestamp(),
        keywords,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      toast.success("Tagihan berhasil ditambahkan!");
    },
    onError: () => {
      toast.error("Gagal menambahkan tagihan.");
    },
  });
}
