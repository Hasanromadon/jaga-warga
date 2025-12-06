'use client';

import { Home, PhoneCall, User } from 'lucide-react';
import { useResidents } from '@/hooks/useResidents';
import { UserNotFoundIllustration } from '@/components/svg/UserNotFoundIllustration';

interface ResidentDetailsProps {
  blok: string;
  nomor: string;
}

const ResidentDetails: React.FC<ResidentDetailsProps> = ({ blok, nomor }) => {
  const { data: residents = [], isLoading: loadingResidents } = useResidents();

  const resident = residents.find(
    (r) => r.block === blok && r.houseNumber === nomor,
  );

  if (loadingResidents) {
    return (
      <div className="h-24 border border-gray-100 justify-start bg-gray-50/60 rounded-lg text-gray-900 shadow-sm flex items-center gap-2">
        <span className="font-semibold text-gray-800 text-xs">
          Mencari data warga...
        </span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {resident ? (
        <div className="w-full border text-xs border-blue-100 bg-blue-50/60 rounded-lg p-5 text-blue-900 shadow-sm ">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-blue-800 text-xs flex items-center gap-1">
              <Home className="w-4 h-4" /> Detail Warga
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="truncate">{resident.name || '-'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-600" />
              <span>
                Blok {resident.block} / {resident.houseNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>{resident.phoneNumber || '-'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-24 border border-red-100 justify-start bg-red-50/60 rounded-lg text-blue-900 shadow-sm flex items-center gap-2">
          <UserNotFoundIllustration className="h-24 w-auto mt-2" />
          <span className="font-semibold text-red-800 text-xs">
            Data Warga tidak ditemukan
          </span>
        </div>
      )}
    </div>
  );
};

export default ResidentDetails;
