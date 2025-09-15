// frontend/app/layout.tsx
// Complete file with shadcn-ui Toaster

import "./globals.css";
import React from "react";
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'AI Data Scientist - Business Analytics for Ghana SMEs',
    template: '%s | AI Data Scientist'
  },
  description: 'Transform your business data into actionable insights with AI-powered analytics.',
  keywords: ['AI analytics', 'business intelligence', 'Ghana SME', 'data analysis'],
  authors: [{ name: 'AI Data Scientist' }],
  creator: 'AI Data Scientist',
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: 'https://yourdomain.com',
    title: 'AI Data Scientist - Business Analytics for Ghana SMEs',
    description: 'Transform your business data into actionable insights.',
    siteName: 'AI Data Scientist',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Data Scientist - Business Analytics for Ghana SMEs',
    description: 'Transform your business data into actionable insights.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}