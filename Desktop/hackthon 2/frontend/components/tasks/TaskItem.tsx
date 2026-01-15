'use client';

import { Task } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

import { memo } from 'react';

export const TaskItem = memo(({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) => {
  const completedAt = task.completed_at ? new Date(task.completed_at) : null;
  const createdAt = new Date(task.created_at);
  const updatedAt = task.updated_at ? new Date(task.updated_at) : null;

  const timeAgo = useMemo(() => {
    if (completedAt) {
      return `Completed ${formatDistanceToNow(completedAt, { addSuffix: true })}`;
    }
    return `Created ${formatDistanceToNow(createdAt, { addSuffix: true })}`;
  }, [completedAt, createdAt]);

  const priorityColors = {
    low: 'bg-green-100 text-green-800 hover:bg-green-200',
    medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    high: 'bg-red-100 text-red-800 hover:bg-red-200',
  } as const;

  const priority = task.priority || 'medium';

  return (
    <Card
      className={cn(
        'group hover:shadow-md transition-all duration-200',
        task.completed && 'border-gray-200 bg-gray-50/50'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => {
                onToggleComplete(task.id, checked as boolean);
              }}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    'text-lg font-medium leading-tight',
                    task.completed && 'line-through text-gray-500'
                  )}
                >
                  {task.title}
                </h3>
                {task.priority && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs font-semibold',
                      priorityColors[task.priority as keyof typeof priorityColors]
                    )}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                )}
              </div>

              {task.description && (
                <p className={cn(
                  'mt-1 text-gray-600 text-sm',
                  task.completed && 'line-through text-gray-400'
                )}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{timeAgo}</span>
                </div>

                {task.completed && completedAt && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
              title="Edit task"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-1">
                {task.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 3 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +{task.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {task.due_date && (
            <div className="text-xs text-gray-500">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  });

TaskItem.displayName = 'TaskItem';
