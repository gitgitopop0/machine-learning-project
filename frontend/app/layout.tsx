import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "คุณเหมือนสัตว์อะไร",
  description: "ระบบทายนิสัยว่าเหมือนสัตว์อะไร",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}