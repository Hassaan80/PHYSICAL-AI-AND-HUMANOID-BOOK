import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ghost' | 'borderless';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    ghost: 'bg-transparent',
    borderless: 'bg-transparent border-none shadow-none',
  };

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6', className)} {...props} />;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div className={cn('p-6 border-t border-gray-200', className)} {...props} />
  );
}
