'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskSortProps {
  sort: 'newest' | 'oldest' | 'priority' | 'due_date';
  onSortChange: (sort: 'newest' | 'oldest' | 'priority' | 'due_date') => void;
}

export function TaskSort({ sort, onSortChange }: TaskSortProps) {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
    { value: 'due_date', label: 'Due Date' },
  ];

  return (
    <div className="flex items-center gap-2 p-4 bg-white rounded-lg border border-gray-200">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
      <div className="relative flex-1">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="w-full appearance-none bg-transparent py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Sort tasks"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
