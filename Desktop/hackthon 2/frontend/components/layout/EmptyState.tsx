import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon ? (
        <div className="mb-4 flex-shrink-0">{icon}</div>
      ) : (
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 00.586 13H0" />
        </svg>
      )}

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      {description && <p className="text-gray-500 text-sm mb-4 max-w-md">{description}</p>}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
