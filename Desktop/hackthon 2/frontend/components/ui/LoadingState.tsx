import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  className,
  size = 'md',
  fullPage = false,
}: LoadingStateProps) {
  const containerClasses = cn(
    'flex flex-col items-center justify-center',
    fullPage ? 'min-h-screen' : 'min-h-[200px]',
    className
  );

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={containerClasses}>
      <LoadingSpinner size={size} className={sizeClasses[size]} />
      {message && (
        <p className={cn('mt-4 text-gray-600', textClasses[size])}>
          {message}
        </p>
      )}
    </div>
  );
}