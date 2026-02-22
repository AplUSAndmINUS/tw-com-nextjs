import type { Metadata } from 'next';
import './globals.css';
import { FluentProvider } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Terence Waters',
    template: '%s | Terence Waters',
  },
  description: 'Author, technologist, and creative thinker.',
  metadataBase: new URL('https://terencewaters.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <FluentProvider>{children}</FluentProvider>
      </body>
    </html>
  );
}
