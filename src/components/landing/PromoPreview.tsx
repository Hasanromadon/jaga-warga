'use client';

import { useAds, Ad } from '@/hooks/useAds';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const formatRupiah = (number: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);

export default function PromoPreview() {
  // Fetch all ads (public view)
  const { data: ads = [], isLoading } = useAds();

  // Take only the first 2 items for preview
  const previewAds = ads.slice(0, 2);

  if (isLoading) {
    return (
      <div className="w-full max-w-sm mt-6 bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 w-32 bg-blue-50 rounded animate-pulse"></div>
          <div className="h-5 w-20 bg-blue-50 rounded-full animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-32 bg-blue-50 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-blue-50 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (previewAds.length === 0) return null;

  return (
    <div className="w-full max-w-sm mt-6 bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-blue-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-orange-500" />
          Pasar Warga
        </h2>
        <Link
          href="/promo"
          className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors bg-blue-50 px-2 py-1 rounded-full"
        >
          Lihat Semua <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {previewAds.map((ad: Ad) => (
          <Link href="/promo" key={ad.id} className="block group">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
              <div className="relative h-24 w-full bg-gray-50">
                {ad.imageUrl ? (
                  <Image
                    src={ad.imageUrl}
                    alt={ad.itemName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="p-2.5 flex flex-col flex-grow">
                <h3 className="text-xs font-semibold text-gray-800 truncate mb-0.5">
                  {ad.itemName}
                </h3>
                <p className="text-xs text-orange-600 font-bold">
                  {formatRupiah(ad.price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
