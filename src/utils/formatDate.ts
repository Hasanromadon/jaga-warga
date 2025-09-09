import { Timestamp } from "firebase/firestore";

/**
 * Format Firestore Timestamp to Indonesian date string.
 * @param ts Timestamp | undefined | null
 * @param opts Intl.DateTimeFormatOptions
 * @returns string (e.g. 09 Sep 2025)
 */
export function formatTimestampID(ts?: Timestamp | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!ts || typeof ts.toDate !== "function") return "-";
  const date = ts.toDate();
  return date.toLocaleDateString("id-ID", opts || { day: "2-digit", month: "short", year: "numeric" });
}
