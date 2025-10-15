import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import toast from "react-hot-toast";

export function useApproveBillMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ billId }: { billId: string }) => {
      // Optionally, you could update keywords if other fields are updated
      await updateDoc(doc(db, "bills", billId), {
        status: "paid",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      toast.success("Tagihan berhasil dikonfirmasi!");
    },
    onError: () => {
      toast.error("Gagal mengkonfirmasi tagihan.");
    },
  });
}

export function useRejectBillMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      billId,
      reason,
    }: {
      billId: string;
      reason: string;
    }) => {
      await updateDoc(doc(db, "bills", billId), {
        status: "rejected",
        rejectReason: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      toast.success("Tagihan berhasil ditolak!");
    },
    onError: () => {
      toast.error("Gagal menolak tagihan.");
    },
  });
}
