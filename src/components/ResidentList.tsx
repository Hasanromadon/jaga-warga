"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  FileDown,
  Phone,
  Plus,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import {
  Resident,
  useAddResident,
  useDeleteResident,
  useEditResident,
  useResidents,
} from "../hooks/useResidents";
import { SearchInput } from "./custom/search-input";
import ResidentForm, { ResidentFormInputs } from "./ResidentForm";
import { EmptyBillIllustration } from "./svg/EmptyBillIllustration";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";

type ResidentCSVRow = {
  name: string;
  block: string;
  houseNumber: string;
  phoneNumber?: string;
};
export default function ResidentList({ onBack }: { onBack?: () => void }) {
  const { residentialId } = useAuth();
  const [search, setSearch] = useState("");
  const { data: residents = [], isLoading } = useResidents(
    residentialId ?? undefined,
    search.trim() ? search.trim().toLowerCase() : undefined
  );
  const residentList = residents;
  const addResident = useAddResident();
  const editResident = useEditResident();
  const deleteResident = useDeleteResident();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Resident | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importedData, setImportedData] = useState<ResidentFormInputs[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
  });
  const [importErrors, setImportErrors] = useState<string[]>([]);

  // Filtering now handled by Firestore query (keywords)
  const filtered = residentList;

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 3MB");
      return;
    }

    // Reset previous state
    setImportErrors([]);
    setImportProgress({ current: 0, total: 0 });

    Papa.parse<ResidentCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: string[] = [];

        // Validate and format data
        const formatted: ResidentFormInputs[] = [];

        results.data.forEach((row, index) => {
          const name = row.name?.trim() || "";
          const block = row.block?.trim() || "";
          const houseNumber = row.houseNumber?.trim() || "";
          const phoneNumber = row.phoneNumber?.trim();

          // Validation
          if (!name || !block || !houseNumber) {
            errors.push(
              `Baris ${
                index + 2
              }: Data tidak lengkap (nama: "${name}", blok: "${block}", nomor: "${houseNumber}")`
            );
            return;
          }

          formatted.push({
            name,
            block,
            houseNumber,
            phoneNumber,
          });
        });

        if (formatted.length === 0) {
          toast.error("Tidak ada data valid untuk diimpor");
          setImportErrors(errors);
          return;
        }

        setImportedData(formatted);
        setImportErrors(errors);

        if (errors.length > 0) {
          toast.success(
            `${formatted.length} data valid siap diimpor (${errors.length} baris diabaikan)`
          );
        } else {
          toast.success(`${formatted.length} data siap diimpor`);
        }
      },
      error: (error) => {
        toast.error(`Gagal membaca file CSV: ${error.message}`);
      },
    });
  };

  const handleBulkImport = async () => {
    if (importedData.length === 0) {
      toast.error("Tidak ada data untuk diimpor");
      return;
    }

    setIsImporting(true);
    setImportProgress({ current: 0, total: importedData.length });

    const errors: string[] = [];
    let successCount = 0;

    try {
      // Process in batches to avoid overwhelming Firestore
      const batchSize = 10;
      for (let i = 0; i < importedData.length; i += batchSize) {
        const batch = importedData.slice(i, i + batchSize);

        // Process batch
        await Promise.allSettled(
          batch.map(async (data, batchIndex) => {
            try {
              await addResident.mutateAsync(data);
              setImportProgress({
                current: i + batchIndex + 1,
                total: importedData.length,
              });
              successCount++;
            } catch (error) {
              const rowNumber = i + batchIndex + 1;
              const errorMsg =
                error instanceof Error
                  ? error.message
                  : "Error tidak diketahui";
              errors.push(
                `Baris ${rowNumber} (${data.name}, Blok ${data.block} No.${data.houseNumber}): ${errorMsg}`
              );
              throw error;
            }
          })
        );

        // Small delay between batches to prevent rate limiting
        if (i + batchSize < importedData.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Show results
      if (errors.length === 0) {
        toast.success(`✅ Semua ${successCount} warga berhasil diimpor!`);
        setImportedData([]);
        setImportErrors([]);
        setShowImport(false);
      } else {
        toast.error(
          `${successCount} berhasil, ${errors.length} gagal. Lihat detail di bawah.`
        );
        setImportErrors(errors);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengimpor data");
      console.error("Bulk import error:", error);
    } finally {
      setIsImporting(false);
      setImportProgress({ current: 0, total: 0 });
    }
  };

  const handleAdd = (data: ResidentFormInputs) => {
    addResident.mutate(data, {
      onSuccess: () => {
        toast.success("Warga berhasil ditambahkan");
        setShowForm(false);
      },
      onError: () => toast.error("Gagal tambah warga"),
    });
  };

  const handleEdit = (data: ResidentFormInputs) => {
    if (!editData) return;
    editResident.mutate(
      { ...editData, ...data },
      {
        onSuccess: () => {
          toast.success("Warga berhasil diupdate");
          setEditData(null);
        },
        onError: () => toast.error("Gagal update warga"),
      }
    );
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };
  const confirmDelete = () => {
    if (!deleteId) return;
    deleteResident.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Warga dihapus");
        setDeleteId(null);
      },
      onError: () => {
        toast.error("Gagal hapus warga");
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="sticky top-0 z-10 bg-gradient-to-b pb-2 pt-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-blue-700 flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-blue-700">
            <EmptyBillIllustration />
            <div className="mt-4 text-base font-semibold">Tidak ada warga.</div>
          </div>
        ) : (
          filtered.map((r) => (
            <Card
              key={r.id}
              className="animate-fade-in border border-gray-200 bg-white/95 shadow-sm rounded-xl px-4 py-2 flex flex-col gap-1"
            >
              <div
                className="font-semibold text-blue-900 text-base truncate"
                title={r.name}
              >
                {r.name}
              </div>
              <div className="flex flex-wrap gap-2 items-center w-full mb-1">
                <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold">
                  Blok {r.block}
                </span>
                <span className="bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs font-normal border border-blue-100">
                  No. {r.houseNumber}
                </span>
              </div>
              {r.phoneNumber && (
                <div className="text-xs text-blue-700 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{r.phoneNumber}</span>
                </div>
              )}
              <div className="flex gap-1 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditData(r)}
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(r.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                {/* Modal Konfirmasi Delete */}
                <Dialog
                  open={!!deleteId}
                  onOpenChange={(v) => {
                    if (!v) setDeleteId(null);
                  }}
                >
                  <DialogContent className="p-6  border-none max-w-xs mx-auto rounded-md">
                    <div className="font-semibold text-lg text-blue-900 mb-2 text-center">
                      Hapus Warga?
                    </div>
                    <div className="text-gray-600 mb-4 text-sm text-center">
                      Data warga akan dihapus secara permanen. Lanjutkan?
                    </div>
                    <div className="flex gap-2 justify-center mt-2">
                      <Button
                        variant="destructive"
                        onClick={confirmDelete}
                        disabled={deleteResident.isPending}
                      >
                        Hapus
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteId(null)}
                        disabled={deleteResident.isPending}
                      >
                        Batal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))
        )}
      </div>
      {/* Modal Add Warga */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-sm mx-auto rounded-md">
          <ResidentForm onSave={handleAdd} />
        </DialogContent>
      </Dialog>
      {/* Modal Edit Warga */}
      <Dialog
        open={!!editData}
        onOpenChange={(v) => {
          if (!v) setEditData(null);
        }}
      >
        <DialogContent className="max-w-sm mx-auto rounded-md">
          {editData && <ResidentForm initial={editData} onSave={handleEdit} />}
        </DialogContent>
      </Dialog>
      {/* Modal Import Warga */}
      <Dialog
        open={showImport}
        onOpenChange={(open) => {
          if (!open && isImporting) {
            toast.error("Tunggu hingga import selesai");
            return;
          }
          setShowImport(open);
          if (!open) {
            setImportedData([]);
            setImportErrors([]);
            setImportProgress({ current: 0, total: 0 });
          }
        }}
      >
        <DialogContent className="max-w-sm mx-auto rounded-md max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-start gap-3">
            <h2 className="text-blue-900 font-semibold text-lg">
              Import Data Warga (CSV)
            </h2>

            {/* File Upload Section */}
            <div className="w-full">
              <Input
                type="file"
                accept=".csv"
                onChange={handleImportFile}
                className="text-sm text-blue-700"
                aria-label="Import Data Warga"
                title="Unggah data warga CSV (maksimal 3MB)"
                disabled={isImporting}
              />
              <div className="text-[11px] text-blue-500 mt-1">
                Hanya menerima file CSV. Ukuran maksimal 3MB.
              </div>
            </div>

            {/* Progress Bar */}
            {isImporting && importProgress.total > 0 && (
              <div className="w-full bg-blue-100 border border-blue-300 rounded-md p-3">
                <div className="text-xs font-semibold text-blue-900 mb-2">
                  Sedang mengimpor... {importProgress.current} dari{" "}
                  {importProgress.total}
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (importProgress.current / importProgress.total) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-blue-600 mt-1">
                  {Math.round(
                    (importProgress.current / importProgress.total) * 100
                  )}
                  % selesai
                </div>
              </div>
            )}

            {/* Preview Valid Data */}
            {importedData.length > 0 && !isImporting && (
              <div className="w-full bg-green-50 border border-green-200 rounded-md p-3 text-xs text-green-700 max-h-40 overflow-y-auto">
                <div className="font-semibold mb-1 flex items-center gap-1">
                  ✅ {importedData.length} data valid siap diimpor:
                </div>
                <ul className="list-disc ml-5 space-y-1">
                  {importedData.slice(0, 5).map((d, i) => (
                    <li key={i}>
                      {d.name} - Blok {d.block} No.{d.houseNumber}
                      {d.phoneNumber && ` (${d.phoneNumber})`}
                    </li>
                  ))}
                  {importedData.length > 5 && (
                    <li className="italic text-gray-500">
                      +{importedData.length - 5} lainnya...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Validation Errors */}
            {importErrors.length > 0 && (
              <div className="w-full bg-red-50 border border-red-200 rounded-md p-3 text-xs text-red-700 max-h-40 overflow-y-auto">
                <div className="font-semibold mb-1 flex items-center gap-1">
                  ⚠️ {importErrors.length} baris bermasalah:
                </div>
                <ul className="list-disc ml-5 space-y-1">
                  {importErrors.slice(0, 10).map((error, i) => (
                    <li key={i} className="text-[11px]">
                      {error}
                    </li>
                  ))}
                  {importErrors.length > 10 && (
                    <li className="italic text-gray-500">
                      +{importErrors.length - 10} error lainnya...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3 w-full">
              <Button
                onClick={handleBulkImport}
                disabled={isImporting || importedData.length === 0}
                className="flex-1"
              >
                {isImporting
                  ? `Mengimpor... (${importProgress.current}/${importProgress.total})`
                  : "Mulai Import"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowImport(false);
                  setImportedData([]);
                  setImportErrors([]);
                  setImportProgress({ current: 0, total: 0 });
                }}
                disabled={isImporting}
              >
                Batal
              </Button>
            </div>

            {/* Help Text */}
            {!importedData.length && !importErrors.length && (
              <div className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-600">
                <div className="font-semibold mb-1">Format CSV:</div>
                <ul className="list-disc ml-5 space-y-0.5">
                  <li>Header: name, block, houseNumber, phoneNumber</li>
                  <li>name, block, houseNumber wajib diisi</li>
                  <li>phoneNumber opsional</li>
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Add + Import Buttons */}
      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {fabOpen && (
            <>
              {/* Download Template */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center gap-2 bg-white border-blue-200 hover:bg-blue-50 shadow-md text-blue-700"
                >
                  <a href="/template_warga.csv" download>
                    <FileDown className="w-4 h-4" />
                    <span>Unduh Template</span>
                  </a>
                </Button>
              </motion.div>

              {/* Import Warga */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <Button
                  onClick={() => {
                    setShowImport(true);
                    setFabOpen(false);
                  }}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Warga</span>
                </Button>
              </motion.div>

              {/* Tambah Warga */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setFabOpen(false);
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tambah Warga</span>
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* FAB utama */}
        <motion.button
          onClick={() => setFabOpen(!fabOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl focus:outline-none transition-all"
          whileTap={{ scale: 0.9 }}
          aria-label="Menu Aksi"
        >
          <motion.div
            animate={{ rotate: fabOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-7 h-7" />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
