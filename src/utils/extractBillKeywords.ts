/**
 * Utility to extract keywords for Firestore search indexing for bills.
 * Ambil kata kunci dari field penting (blok, nomor rumah, nama, bulan, tahun, dsb).
 */
import { Bill } from "../types/bill";

export const extractBillKeywords = (
  item: Partial<Bill> & Record<string, string | undefined | null>
): string[] => {
  const keywordsSet = new Set<string>();
  // Ambil field penting
  const fields = [
    item.block,
    item.houseNumber,
    item.month,
    item.year,
    item.status,
    item.remark,
    item.residentName,
  ];
  fields.forEach((val) => {
    if (typeof val === "string") {
      const words = val.split(" ");
      words.forEach((word) => {
        const cleanedWord = word
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
          .toLowerCase();
        if (cleanedWord !== "" && cleanedWord.length >= 3) {
          keywordsSet.add(cleanedWord);
          for (let i = 3; i <= Math.min(cleanedWord.length, 5); i++) {
            keywordsSet.add(cleanedWord.substring(0, i));
          }
        }
      });
    }
  });
  return [...keywordsSet];
};
