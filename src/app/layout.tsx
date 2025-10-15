import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jaga Warga - Aplikasi Iuran & Pengelolaan Lingkungan Perumahan",
  description:
    "Jaga Warga adalah aplikasi digital untuk membantu warga mengelola iuran, laporan, dan kegiatan lingkungan perumahan secara mudah dan transparan.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "Jaga Warga",
    "aplikasi iuran",
    "pengelolaan lingkungan",
    "RT RW digital",
    "manajemen warga",
    "iuran perumahan",
    "aplikasi warga",
  ],
  authors: [{ name: "Tim Jaga Warga", url: "https://jaga-warga.vercel.app" }],
  metadataBase: new URL("https://jaga-warga.vercel.app"),
  openGraph: {
    title: "Jaga Warga - Aplikasi Iuran & Pengelolaan Lingkungan Perumahan",
    description:
      "Kelola iuran, laporan, dan kegiatan lingkungan secara digital bersama Jaga Warga.",
    url: "https://jaga-warga.vercel.app",
    siteName: "Jaga Warga",
    images: [
      {
        url: "/favicon.ico",
        width: 600,
        height: 600,
        alt: "Jaga Warga",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  themeColor: "#2563eb",
  applicationName: "Jaga Warga",
  category: "Community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className + " bg-gray-50 min-h-screen"}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
