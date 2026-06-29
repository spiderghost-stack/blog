import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Providers } from "@/app/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindLog | Blog personnel moderne",
  description: "MindLog est un blog personnel moderne, responsive et pensé pour publier, lire et organiser du contenu avec élégance.",
  metadataBase: new URL("https://mindlog.dev"),
  openGraph: {
    title: "MindLog | Blog personnel moderne",
    description: "Publiez, lisez et gérez votre contenu avec une expérience premium.",
    type: "website",
    url: "https://mindlog.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindLog | Blog personnel moderne",
    description: "Publiez, lisez et gérez votre contenu avec une expérience premium.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
