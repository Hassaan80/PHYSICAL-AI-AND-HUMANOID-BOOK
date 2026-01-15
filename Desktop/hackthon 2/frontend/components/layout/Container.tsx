import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 md:px-6', className)}>
      {children}
    </div>
  );
}
