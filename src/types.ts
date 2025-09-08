// IPL App types

export interface Bill {
  id: string;
  userId: string;
  bulan: string;
  tahun: string;
  nominal: number;
  status: string;
  buktiBayarURL?: string;
  blokRumah: string;
  nomorRumah: string;
  nama: string;
}
