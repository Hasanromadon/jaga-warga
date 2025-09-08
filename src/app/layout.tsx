
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from './layout-client';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'IPL App',
  description: 'Aplikasi Iuran Pengelolaan Lingkungan Perumahan',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className + ' bg-gray-50 min-h-screen'}>
  <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
