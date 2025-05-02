import type { Metadata } from 'next';
import './globals.css';
import './fonts.css';
import { AnimatePresence } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Dillon Marinez - Senior Front-End Developer',
  description: 'Portfolio of Dillon Marinez, Senior Front-End Developer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500&display=swap"
        rel="stylesheet"
      />
      </head>
      <body>
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </body>
    </html>
  );
}