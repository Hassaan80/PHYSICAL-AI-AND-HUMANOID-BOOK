'use client';

import { Task } from '@/lib/types';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskSort } from '@/components/tasks/TaskSort';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  loading: 'loading' | 'success' | 'error';
  error: string | null;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onCreateTask?: () => void;
}

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'newest' | 'oldest' | 'priority' | 'due_date';

export function TaskList({
  tasks,
  loading,
  error,
  onToggleComplete,
  onEdit,
  onDelete,
  onCreateTask,
}: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (filter === 'active' && task.completed) return false;
      if (filter === 'completed' && !task.completed) return false;

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description?.toLowerCase().includes(query) || false;
        const matchesTags = task.tags?.some((tag) => tag.toLowerCase().includes(query)) || false;

        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      // Priority filter
      if (priorityFilter.length > 0 && task.priority) {
        if (!priorityFilter.includes(task.priority)) {
          return false;
        }
      }

      // Tag filter
      if (tagFilter.length > 0 && task.tags) {
        const hasMatchingTag = task.tags.some((tag) => tagFilter.includes(tag));
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, filter, searchQuery, priorityFilter, tagFilter]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const tasksToSort = [...filteredTasks];

    switch (sort) {
      case 'newest':
        return tasksToSort.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return tasksToSort.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1, undefined: 0 };
        return tasksToSort.sort((a, b) => {
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return bPriority - aPriority || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      }
      case 'due_date': {
        return tasksToSort.sort((a, b) => {
          const aDue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
          const bDue = b.due_date ? new Date(b.due_date).getTime() : Infinity;
          return aDue - bDue;
        });
      }
      default:
        return tasksToSort;
    }
  }, [filteredTasks, sort]);

  // Extract available filters
  const availablePriorities = useMemo(() => {
    const priorities = new Set<string>();
    tasks.forEach((task) => {
      if (task.priority) {
        priorities.add(task.priority);
      }
    });
    return Array.from(priorities);
  }, [tasks]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    tasks.forEach((task) => {
      if (task.tags) {
        task.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [tasks]);

  if (loading === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingState message="Loading tasks..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error loading tasks
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<Plus className="h-12 w-12" />}
        title="No tasks yet"
        description="Create your first task to get started"
        action={
          onCreateTask && (
            <Button onClick={onCreateTask}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          )
        }
      />
    );
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length,
    filtered: sortedTasks.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600 text-sm mt-1">
            {stats.total} total • {stats.active} active • {stats.completed} completed
            {sortedTasks.length !== tasks.length && (
              <span className="ml-2 text-blue-600">
                • Showing {sortedTasks.length} filtered
              </span>
            )}
          </p>
        </div>

        {onCreateTask && (
          <Button onClick={onCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <TaskFilters
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            tagFilter={tagFilter}
            onTagFilterChange={setTagFilter}
            availablePriorities={availablePriorities}
            availableTags={availableTags}
          />
        </div>
        <div>
          <TaskSort sort={sort} onSortChange={setSort} />
        </div>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tasks match your filters
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search query
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
              setPriorityFilter([]);
              setTagFilter([]);
            }}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TaskItem
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
