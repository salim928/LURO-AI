// frontend/app/(landing)/layout.tsx
// Landing pages layout - Server Component (no 'use client')

import Link from 'next/link';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-container">
      <header className="mb-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div className="leading-tight">
            <div className="text-lg font-semibold text-accent">LURO-AI</div>
            <div className="text-xs muted">Fast, affordable analytics for SMEs</div>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="btn-secondary text-sm px-4 py-2">
            Sign In
          </Link>
          <Link href="/sign-up" className="btn-primary text-sm px-4 py-2">
            Get Started
          </Link>
        </div>
      </header>

      <nav className="w-full mb-8">
        <div className="w-full flex justify-center">
          <ul className="flex items-center gap-12 md:gap-16 whitespace-nowrap flex-nowrap">
            <li className="mx-2">
              <Link href="/" className="inline-block text-base px-5 py-2 rounded hover:bg-[rgba(255,255,255,0.02)] text-accent font-medium">
                Home
              </Link>
            </li>
            <li className="mx-2">
              <Link href="/about" className="inline-block text-base px-5 py-2 rounded hover:bg-[rgba(255,255,255,0.02)] muted hover:text-accent font-medium">
                About
              </Link>
            </li>
            <li className="mx-2">
              <Link href="/pricing" className="inline-block text-base px-5 py-2 rounded hover:bg-[rgba(255,255,255,0.02)] muted hover:text-accent font-medium">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="min-h-[60vh]">{children}</main>

      <footer className="mt-12 text-sm muted">
        <div className="panel text-xs">
          © {new Date().getFullYear()} LURO-AI — Built for Ghana SMEs
        </div>
      </footer>
    </div>
  );
}