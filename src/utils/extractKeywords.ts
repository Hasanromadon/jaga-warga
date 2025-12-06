/**
 * Utility to extract keywords for Firestore search indexing.
 *
 * Fungsi ini mengambil semua properti string dari sebuah objek,
 * memecahnya menjadi kata-kata, membersihkan tanda baca,
 * dan menghasilkan array keyword unik (termasuk prefix 3-5 karakter awal setiap kata).
 *
 * Cocok untuk membuat field 'keywords' pada dokumen Firestore,
 * sehingga pencarian substring/autocomplete bisa dilakukan dengan query 'array-contains'.
 *
 * Contoh penggunaan:
 *   const keywords = extractKeywords({ name: 'Budi Santoso', block: 'A', houseNumber: '12' });
 *   // keywords: ['bud', 'budi', 'san', 'sant', 'santoso', ...]
 *
 * @param item Objek dengan properti string yang ingin di-index
 * @returns Array string keyword unik hasil ekstraksi
 */
export const extractKeywords = (
  item: Record<string, string | undefined | null>,
): string[] => {
  const keywordsSet = new Set<string>();

  for (const key in item) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      if (typeof item[key] === 'string') {
        const words = item[key].split(' ');
        words.forEach((word) => {
          // Remove punctuation and convert to lowercase
          const cleanedWord = word
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .toLowerCase();
          if (cleanedWord !== '' && cleanedWord.length >= 3) {
            // Only add the full word and 3-5 char prefixes
            keywordsSet.add(cleanedWord);
            for (let i = 3; i <= Math.min(cleanedWord.length, 5); i++) {
              keywordsSet.add(cleanedWord.substring(0, i));
            }
          }
        });
      }
    }
  }

  return [...keywordsSet];
};
