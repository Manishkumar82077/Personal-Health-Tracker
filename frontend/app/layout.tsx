import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { AuthGuard } from '@/components/AuthGuard';
import { BottomNav } from '@/components/BottomNav';
import { ThemeProvider } from '@/components/ThemeProvider';

// Runs before paint to apply the saved theme and avoid a flash of the wrong mode.
const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d){r.classList.add('dark');r.style.colorScheme='dark';}else{r.style.colorScheme='light';}}catch(e){}})();`;

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Health Tracker',
  description: 'Personal health dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <ThemeProvider>
          <AuthProvider>
            <AuthGuard>
              <main className="flex-1 pb-20">
                {children}
              </main>
              <BottomNav />
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
