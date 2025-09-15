
// CREATE: frontend/app/(landing)/error.tsx
'use client';

import { useEffect } from 'react';

export default function LandingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Landing page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-2xl font-bold text-on-surface">Oops! Something went wrong</h2>
      <p className="text-muted max-w-md text-center">
        We encountered an error while loading this page. Please try again.
      </p>
      <button onClick={reset} className="btn-primary">
        Refresh Page
      </button>
    </div>
  );
}