'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { LogOut, User, Hash, MapPin, Phone, Building2 } from 'lucide-react';
import { useAuthContext } from '@/context/AuthProvider';
import { doc, getDoc, type Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { formatTimestampID } from '@/utils/formatDate';
import {
  useResidentialInfo,
  type ManagementContact,
} from '@/hooks/useResidentialInfo';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DEMO_RESIDENTIAL_ID } from '@/constants';

type UserProfile = {
  name?: string;
  phoneNumber?: string;
  residential_id?: string;
  created_at?: Timestamp | null;
  [key: string]: unknown;
};

export default function ProfileCard() {
  const { user, role, residentialId, signOut } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const router = useRouter();

  const { data: residentialInfo, isLoading: loadingResidential } =
    useResidentialInfo(residentialId || undefined);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user?.uid) return;

      if (mounted) setLoadingProfile(true);
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!mounted) return;
        setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const handleSignOut = async () => {
    const currentResidentialId = residentialId;
    await signOut();
    const target = DEMO_RESIDENTIAL_ID || currentResidentialId;
    router.push(target ? `/login/${target}` : '/login');
  };

  const handleCopyId = async () => {
    const id = profile?.residential_id || residentialId;
    if (id) {
      await navigator.clipboard.writeText(id);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pb-20">
      {/* Header / User Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-500 opacity-10" />

        <div className="relative flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900 truncate">
              {profile?.name || user?.displayName || 'Pengguna'}
            </h2>
            <p className="text-sm text-blue-600 font-medium capitalize">
              {role || 'Warga'}
            </p>
          </div>
        </div>

        {loadingProfile ? (
          <div className="text-center text-sm text-slate-500 py-4">
            Memuat data pengguna...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">Email</p>
                <p className="font-medium truncate">{user?.email || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">No. Telepon</p>
                <p className="font-medium truncate">
                  {(profile?.phoneNumber as string) ||
                    (user?.phoneNumber as string) ||
                    '-'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Residential Info Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Informasi Hunian
        </h3>

        {loadingResidential ? (
          <div className="text-center text-sm text-slate-500 py-4">
            Memuat informasi hunian...
          </div>
        ) : residentialInfo ? (
          <div className="space-y-6">
            {/* Logo & Name */}
            <div className="flex flex-col items-center text-center">
              {residentialInfo.logo ? (
                <div className="relative w-20 h-20 mb-3">
                  <Image
                    src={residentialInfo.logo}
                    alt="Logo Hunian"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <Building2 className="w-8 h-8 text-blue-300" />
                </div>
              )}
              <h4 className="font-bold text-slate-800 text-lg">
                {residentialInfo.name}
              </h4>
              <div className="flex items-center justify-center gap-1 mt-1 text-slate-500 text-sm">
                <Hash className="w-3 h-3" />
                <span>ID: {residentialId}</span>
              </div>
            </div>

            {/* Address */}
            {residentialInfo.address && (
              <div className="flex gap-3 items-start bg-blue-50/50 p-3 rounded-xl">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  {residentialInfo.address}
                </p>
              </div>
            )}

            {/* Management Contacts */}
            {residentialInfo.management &&
              residentialInfo.management.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Kontak Pengurus
                  </p>
                  <div className="space-y-2">
                    {residentialInfo.management.map(
                      (contact: ManagementContact, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {contact.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {contact.phone}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() =>
                              window.open(
                                `https://wa.me/${contact.phone.replace(/\D/g, '')}`,
                                '_blank',
                              )
                            }
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="text-center text-sm text-slate-500 py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            Belum ada informasi hunian
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleCopyId}
          variant="outline"
          className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
        >
          <Hash className="w-4 h-4 mr-2" />
          Salin ID Hunian
        </Button>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Keluar
        </Button>
      </div>
    </div>
  );
}
