'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthProvider';
import { ReactQueryProvider } from '../context/ReactQueryProvider';
import ToastProvider from '../components/ToastProvider';
import { AdGeneratorModalProvider } from '@/context/AdGeneratorModalProvider';

export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <AdGeneratorModalProvider>
          <ToastProvider />
          {children}
        </AdGeneratorModalProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
