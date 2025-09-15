// CREATE: frontend/app/(auth)/loading.tsx
export default function AuthLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
    </div>
  );
}