"use client";
import { ReactNode } from "react";
import { AuthProvider } from '../context/AuthProvider';
import { ReactQueryProvider } from '../context/ReactQueryProvider';

export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
}
