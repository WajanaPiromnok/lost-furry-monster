import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lost Furry Monster",
  description: "Mini web game สำหรับตามหามอนสเตอร์ให้เจอแล้วพาเข้าสู่โปสเตอร์ปิดท้าย",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
