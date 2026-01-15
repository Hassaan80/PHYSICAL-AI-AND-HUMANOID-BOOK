'use client';

import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({
  className,
  checked,
  onCheckedChange,
  disabled,
  ...props
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (onCheckedChange) {
      onCheckedChange(isChecked);
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-gray-300',
          'checked:border-blue-600 checked:bg-blue-600',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          className
        )}
        aria-checked={checked}
        {...props}
      />
      <svg
        className={cn(
          'pointer-events-none absolute left-0 top-0 h-4 w-4 fill-white opacity-0 peer-checked:opacity-100',
          disabled && 'opacity-0'
        )}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
      </svg>
    </div>
  );
}
