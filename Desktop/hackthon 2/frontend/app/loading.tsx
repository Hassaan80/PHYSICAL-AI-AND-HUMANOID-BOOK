import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <LoadingSpinner />
      <p className="mt-4 text-sm text-gray-500">Loading...</p>
    </div>
  );
}