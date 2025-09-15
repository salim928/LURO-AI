// CREATE: frontend/app/dashboard/loading.tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}