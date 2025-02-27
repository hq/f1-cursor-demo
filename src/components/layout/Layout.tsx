import { FC, ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export const Layout: FC<LayoutProps> = ({ 
  children, 
  title = 'F1 Driver Tracker - 2024 Season',
  description = 'Formula One driver tracker for the 2024 season'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-neutral-200 bg-white shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold">F1<span className="text-red-600">2024</span></span>
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <Link href="/" className="text-neutral-600 hover:text-neutral-900">
                    Drivers
                  </Link>
                </li>
                <li>
                  <a href="https://formula1.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-900">
                    Official F1
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 bg-neutral-50 px-4 py-8">
          {children}
        </main>
        
        <footer className="border-t border-neutral-200 bg-white py-6">
          <div className="container mx-auto px-4 text-center text-sm text-neutral-500">
            <p>
              F1 Driver Tracker - Data provided by OpenF1 API
            </p>
            <p className="mt-2">
              This is a demo application and is not affiliated with Formula 1 or FIA.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}; 