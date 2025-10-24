"use client";

import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthProvider";
import { ReactQueryProvider } from "../context/ReactQueryProvider";
import ToastProvider from "../components/ToastProvider";

export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </ReactQueryProvider>
  );
}
