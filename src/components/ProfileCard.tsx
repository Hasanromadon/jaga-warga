'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { LogOut, User, Hash } from 'lucide-react';
import { useAuthContext } from '@/context/AuthProvider';
import { doc, getDoc, type Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { formatTimestampID } from '@/utils/formatDate';

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
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user?.uid) return;

      if (mounted) setLoading(true); // Set loading true
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!mounted) return;
        setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        if (mounted) setLoading(false); // Set loading false
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const handleSignOut = async () => {
    await signOut();
  };

  // Restored from your first version
  const handleCopyId = async () => {
    const id = profile?.residential_id || residentialId;
    if (id) await navigator.clipboard.writeText(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-lg p-4 shadow-sm">
        <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-medium text-blue-900 truncate">
            {profile?.name ||
              user?.displayName ||
              user?.email?.split('@')[0] ||
              'Admin'}
          </p>
          <p className="text-sm text-blue-600 capitalize truncate">
            {role || '-'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-100">
        {/* Added loading indicator */}
        {loading ? (
          <div className="text-center text-sm text-slate-500 p-4">
            Memuat data...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">Email</span>
              <span className="font-medium truncate">{user?.email || '-'}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">No. Telepon</span>
              <span className="font-medium truncate">
                {(profile?.phoneNumber as string) ||
                  (user?.phoneNumber as string) ||
                  '-'}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">Residensi ID</span>
              <span className="font-medium truncate">
                {profile?.residential_id || residentialId || '-'}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">Terdaftar</span>
              <span className="font-medium truncate">
                {profile?.created_at
                  ? formatTimestampID(profile.created_at as Timestamp)
                  : '-'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Keluar
        </Button>
        {/* Restored onClick handler from your first version */}
        <Button variant="ghost" className="flex-1" onClick={handleCopyId}>
          <Hash className="w-4 h-4 mr-2" />
          Salin ID
        </Button>
      </div>
    </div>
  );
}
