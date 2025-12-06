'use client';

import {
  Tag,
  MapPin,
  User,
  Search,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAds, Ad } from '../../hooks/useAds';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import Footer from '@/components/landing/Footer';

const formatRupiah = (number: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);

const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 animate-pulse">
    <div className="h-40 w-full bg-blue-50"></div>
    <div className="p-4">
      <div className="h-5 bg-blue-100 rounded w-3/4 mb-3"></div>
      <div className="space-y-2">
        <div className="h-3 bg-blue-50 rounded w-full"></div>
        <div className="h-3 bg-blue-50 rounded w-5/6"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-50 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
          <div className="h-3 bg-blue-50 rounded w-1/2"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
          <div className="h-3 bg-blue-50 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function PromoPage() {
  const router = useRouter();
  const { residentialId } = useAuth();
  const { data: ads = [], isLoading } = useAds(residentialId ?? undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAds = useMemo(() => {
    if (!searchQuery) return ads;
    const lowercasedQuery = searchQuery.toLowerCase();
    return ads.filter(
      (ad: Ad) =>
        ad.itemName.toLowerCase().includes(lowercasedQuery) ||
        ad.headline.toLowerCase().includes(lowercasedQuery) ||
        ad.adBody.toLowerCase().includes(lowercasedQuery) ||
        ad.residentName.toLowerCase().includes(lowercasedQuery),
    );
  }, [ads, searchQuery]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (ads.length === 0) {
      return (
        <div className="text-center py-16 text-blue-900/60">
          <ShoppingBag className="mx-auto h-12 w-12 text-blue-200" />
          <h3 className="mt-2 text-lg font-medium">Belum ada promosi</h3>
          <p className="mt-1 text-sm">
            Coba cek lagi nanti untuk melihat penawaran dari warga!
          </p>
        </div>
      );
    }

    if (filteredAds.length === 0) {
      return (
        <div className="text-center py-16 text-blue-900/60">
          <h3 className="text-lg font-medium">Promosi tidak ditemukan</h3>
          <p className="mt-1 text-sm">
            Coba gunakan kata kunci lain untuk mencari promosi.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filteredAds.map((ad: Ad) => (
          <div
            key={ad.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-blue-100"
          >
            <div className="relative h-40 w-full bg-blue-50">
              {ad.imageUrl ? (
                <Image
                  src={ad.imageUrl}
                  alt={ad.itemName}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-blue-200" />
                </div>
              )}
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                {formatRupiah(ad.price)}
              </div>
            </div>
            <div className="p-4">
              <h2
                className="text-base font-bold text-blue-900 truncate"
                title={ad.headline}
              >
                {ad.headline}
              </h2>
              <p className="text-sm text-blue-800/80 mt-1 whitespace-pre-wrap">
                {ad.adBody}
              </p>

              <div className="mt-4 pt-4 border-t border-blue-50 flex flex-col gap-2 text-xs text-blue-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="truncate">{ad.residentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="truncate">
                    Blok {ad.block} No. {ad.houseNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="font-semibold truncate italic">{`"${ad.shortTagline}"`}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white font-sans">
      <div className="px-4 py-3 sticky top-0 z-20 bg-blue-50/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            size="icon"
            className="text-blue-900 hover:bg-blue-100 h-9 w-9 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-blue-900 leading-tight">
              Pasar Warga
            </h1>
            <p className="text-[10px] text-blue-600 leading-tight">
              Dukung usaha tetangga!
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-4 pb-10 pt-4">
        <div className="w-full max-w-3xl">
          <div className="mb-6">
            <div className="relative shadow-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="Cari kue, jasa, atau nama tetangga..."
                className="w-full pl-11 pr-4 py-3 border-none rounded-xl bg-white shadow-md focus:ring-2 focus:ring-blue-500 outline-none transition text-blue-900 placeholder:text-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {renderContent()}
        </div>

        <Footer />
      </div>
    </main>
  );
}
