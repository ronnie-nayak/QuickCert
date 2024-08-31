import './globals.css';
import { Quicksand } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'QuickCert',
  description: 'Streamline your certification process'
};
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function HomepageLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="" lang="en">
      <body className={quicksand.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
