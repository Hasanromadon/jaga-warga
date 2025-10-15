import { Timestamp } from "firebase/firestore";

/**
 * Format Firestore Timestamp to Indonesian date string.
 * @param ts Timestamp | undefined | null
 * @param opts Intl.DateTimeFormatOptions
 * @returns string (e.g. 09 Sep 2025)
 */
export function formatTimestampID(
  ts?: Timestamp | null,
  opts?: Intl.DateTimeFormatOptions
): string {
  if (!ts || typeof ts.toDate !== "function") return "-";
  const date = ts.toDate();
  return date.toLocaleDateString(
    "id-ID",
    opts || { day: "2-digit", month: "short", year: "numeric" }
  );
}

export function getMonthName(month: number | string): string {
  const monthNumber = typeof month === "string" ? parseInt(month, 10) : month;

  const MONTH_NAMES = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return "Bulan Tidak Valid";
  }

  return MONTH_NAMES[monthNumber - 1];
}
