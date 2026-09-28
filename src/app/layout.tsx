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
  applicationName: "Górnik Radlin – Mecze",
  openGraph: {
    title: "Górnik Radlin – Mecze",
    description: "Terminarz Żaków, Trampkarzy i Seniorów Górnika Radlin.",
    type: "website",
    locale: "pl_PL",
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
