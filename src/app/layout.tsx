
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeoVeraxis",
  description: "Gestión de documentos notariales geoespaciales con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
