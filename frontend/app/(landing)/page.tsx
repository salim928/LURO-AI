// frontend/app/(landing)/page.tsx
// Server Component - Can export metadata
// NO 'use client' directive here

import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Home',
  description: 'AI-powered business analytics platform for Ghana SMEs. Get actionable insights from your data.',
};

export default function HomePage() {
  return <HomePageClient />;
}