import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import Footer from "@/components/Footer";
import InAppBrowserNotice from "@/components/InAppBrowserNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Górnik Radlin – Mecze",
  description: "Terminarze wszystkich drużyn Górnika Radlin w jednym miejscu.",
  metadataBase: new URL("https://mecze.adiczq.dev"),
  manifest: "/manifest.webmanifest",

  openGraph: {
    title: "Górnik Radlin – Mecze",
    description:
      "Terminarze wszystkich drużyn Górnika Radlin w jednym miejscu.",
    url: "https://mecze.adiczq.dev",
    siteName: "Górnik Radlin – Mecze",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Górnik Radlin – Mecze",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Górnik Radlin – Mecze",
    description:
      "Terminarze wszystkich drużyn Górnika Radlin w jednym miejscu.",
    images: ["/opengraph-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <ServiceWorkerRegister />

        <main className="flex-1">{children}</main>

        <Footer />

        <InAppBrowserNotice />
      </body>
    </html>
  );
}
