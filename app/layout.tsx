import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARMA Store',
  description: 'Hyperlocal Grocery Marketplace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full bg-[#f8fafc] text-slate-900 flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
