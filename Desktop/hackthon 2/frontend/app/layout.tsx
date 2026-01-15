import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TaskFlow - Professional Task Management',
    template: '%s | TaskFlow',
  },
  description: 'TaskFlow is a professional task management application built with Next.js, featuring authentication, CRUD operations, advanced filtering, sorting, and responsive design.',
  keywords: 'tasks, todo, management, productivity, nextjs, react',
  authors: [{ name: 'TaskFlow Team' }],
  creator: 'TaskFlow Team',
  publisher: 'TaskFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://taskflow.example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taskflow.example.com',
    siteName: 'TaskFlow',
    title: {
      default: 'TaskFlow - Professional Task Management',
      template: '%s | TaskFlow',
    },
    description: 'TaskFlow is a professional task management application built with Next.js, featuring authentication, CRUD operations, advanced filtering, sorting, and responsive design.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TaskFlow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: 'TaskFlow - Professional Task Management',
      template: '%s | TaskFlow',
    },
    description: 'TaskFlow is a professional task management application built with Next.js.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
