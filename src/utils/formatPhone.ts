import { Bill } from "@/types/bill";
import { getMonthName } from "./formatDate";

export function normalizeWaNumber(raw?: string | null) {
  if (!raw) return null;

  let n = raw.replace(/[^\d+]/g, "");

  if (n.startsWith("+62")) {
    n = n.slice(1);
  } else if (n.startsWith("0")) {
    n = "62" + n.slice(1);
  } else if (n.startsWith("8")) {
    n = "62" + n;
  }

  n = n.replace(/[^\d]/g, "");

  return n || null;
}

export function makeWaUrl(bill: Bill) {
  const num = normalizeWaNumber((bill as Bill).phoneNumber);
  if (!num) return null;

  const rupiah = (amt: number) =>
    amt
      .toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      })
      .replace(/,00$/, "");

  const text = [
    `Assalamualaikum Bapak/Ibu ${(bill as Bill).residentName || "Saudara"},`,
    `Ini pengingat tagihan Iuran:`,
    `• Blok ${bill.block} No ${bill.houseNumber}`,
    `• Periode: ${getMonthName(bill.month)} ${bill.year}`,
    `• Jumlah: ${rupiah(Number(bill.amount))}`,
    bill.remark ? `• Catatan: ${bill.remark}` : null,
    ``,
    `Mohon melakukan pembayaran. Terima kasih 🙏`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
