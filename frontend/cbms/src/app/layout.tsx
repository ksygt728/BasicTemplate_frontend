import type { Metadata } from "next";
import "./globals.css";
import { AlertProvider } from "@/contexts/AlertContext";
import ReduxProvider from "@/store/providers/ReduxProvider";
import { AuthProvider } from "@/store/providers/AuthProvider";

export const metadata: Metadata = {
  title: "CBMS - Comprehensive Business Management System",
  description: "Modern business management system with Linear Dark theme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full m-0 p-0">
        <ReduxProvider>
          <AlertProvider>
            <AuthProvider>{children}</AuthProvider>
          </AlertProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
