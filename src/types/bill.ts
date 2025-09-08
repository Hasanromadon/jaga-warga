export type Bill = {
  id: string;
  userId: string;
  bulan: string;
  tahun: string;
  nominal: number;
  status: string;
  buktiBayarURL?: string;
};
