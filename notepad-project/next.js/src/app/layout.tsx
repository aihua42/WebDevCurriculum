//'use client'; // 이걸 켜면 metadata를 주석처리 해줘야 한다.
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // <a></a> tag downloads the page every time, but Link downloads the file when the mouse on the event target. This is single page application.

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { // server client에서 metadata를 사용
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
