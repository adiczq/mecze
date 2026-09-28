import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Górnik Radlin – Mecze",
  description: "Terminarz Żaków, Trampkarzy i Seniorów Górnika Radlin.",
  metadataBase: new URL("https://mecze.adiczq.dev"),

  openGraph: {
    title: "Górnik Radlin – Mecze",
    description: "Terminarz Żaków, Trampkarzy i Seniorów Górnika Radlin.",
    url: "https://mecze.adiczq.dev",
    siteName: "Górnik Radlin – Mecze",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Górnik Radlin – Mecze",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
