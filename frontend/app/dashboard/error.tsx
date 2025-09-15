// CREATE: frontend/app/dashboard/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
      <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-on-surface mb-2">
          Something went wrong!
        </h2>
        <p className="text-muted mb-4 max-w-md">
          {error.message || 'An unexpected error occurred while loading the dashboard.'}
        </p>
      </div>
      <button 
        onClick={reset}
        className="btn-primary"
      >
        Try again
      </button>
    </div>
  );
}
