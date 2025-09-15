
// CREATE: frontend/app/global-error.tsx (for root level errors)
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-muted mb-6">A critical error occurred.</p>
            <button 
              onClick={reset}
              className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
