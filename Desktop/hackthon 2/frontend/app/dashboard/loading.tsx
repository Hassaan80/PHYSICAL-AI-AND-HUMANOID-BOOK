import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 px-4">
      <LoadingSpinner />
      <p className="mt-4 text-sm text-gray-500">Loading your tasks...</p>
    </div>
  );
}