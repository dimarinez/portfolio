import type { Metadata } from 'next';
import './globals.css';
import './fonts.css';
import AnimationRoot from './components/AnimationRoot';

export const metadata: Metadata = {
  title: 'Dillon Marinez - Senior Front-End Developer',
  description: 'Portfolio of Dillon Marinez, Senior Front-End Developer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnimationRoot childrenProp={children} />
      </body>
    </html>
  );
}