import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AddBillFormInputs } from "../components/AddBillForm";
import { Resident } from "./useResidents";
import { extractBillKeywords } from "../utils/extractBillKeywords";
import toast from "react-hot-toast";

export function useAddBulkBillsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      residents,
      data,
    }: {
      residents: Resident[];
      data: Omit<AddBillFormInputs, "block" | "houseNumber">;
    }) => {
      await Promise.all(
        residents.map((resident) => {
          const billData = {
            ...data,
            block: resident.block,
            houseNumber: resident.houseNumber,
            residentId: resident.id,
            residential_id: resident.residential_id,
            residentName: resident.name,
            phoneNumber: resident.phoneNumber || "",
            status: "unpaid",
            proofUrl: "",
            createdAt: serverTimestamp(),
          };
          const keywords = extractBillKeywords(
            billData as unknown as Record<string, string | null | undefined>
          );
          return addDoc(collection(db, "bills"), { ...billData, keywords });
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      toast.success("Tagihan massal berhasil ditambahkan!");
    },
    onError: () => {
      toast.error("Gagal menambahkan tagihan massal.");
    },
  });
}
