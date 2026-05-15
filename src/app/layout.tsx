import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/provedores/QueryProvider";
import { AuthProvider } from "@/provedores/AuthProvider";
import { HydrationProvider } from "@/provedores/HydrationProvider";
import { SplashScreen } from "@/componentes/ui/SplashScreen";
import { SyncProvider } from "@/provedores/SyncProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consistex",
  description: "Seu app premium de consistência e hábitos saudáveis",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/logo-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Consistex",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <HydrationProvider>
          <SplashScreen />
          <QueryProvider>
            <AuthProvider>
              <SyncProvider>
                <main className="min-h-[100dvh] safe-top safe-bottom">
                  {children}
                </main>
              </SyncProvider>
            </AuthProvider>
          </QueryProvider>
        </HydrationProvider>
      </body>
    </html>
  );
}
