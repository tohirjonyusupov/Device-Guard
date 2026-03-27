import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyDevices — Qurilmalaringizni himoya qiling',
  description:
    "Qurilmalaringizni ro'yxatdan o'tkazing, yo'qolsa bildiring va boshqalar tekshirsin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
