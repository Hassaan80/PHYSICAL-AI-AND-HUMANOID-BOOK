'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, LoadingState } from '@/lib/types';
import { tasksApi } from '@/lib/api';

interface UseTasksReturn {
  tasks: Task[];
  loading: LoadingState;
  error: string | null;
  getTasks: () => Promise<void>;
  createTask: (title: string, description: string) => Promise<Task>;
  updateTask: (id: string, updates: { title?: string; description?: string; completed?: boolean }) => Promise<Task>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Initial fetch on mount
  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = useCallback(async () => {
    setLoading('loading');
    setError(null);

    try {
      const fetchedTasks = await tasksApi.getTasks();
      setTasks(fetchedTasks);
      setLoading('success');
    } catch (err: any) {
      const errorMessage = err?.error?.message || 'Failed to fetch tasks';
      setError(errorMessage);
      setLoading('error');
    }
  }, []);

  const createTask = useCallback(
    async (title: string, description: string): Promise<Task> => {
      try {
        const newTask = await tasksApi.createTask({ title, description });
        setTasks((prev) => [newTask, ...prev]);
        return newTask;
      } catch (err: any) {
        const errorMessage = err?.error?.message || 'Failed to create task';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (id: string, updates: { title?: string; description?: string; completed?: boolean }): Promise<Task> => {
      const previousTask = tasks.find((task) => task.id === id);
      if (!previousTask) {
        throw new Error('Task not found');
      }

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        )
      );

      try {
        const updatedTask = await tasksApi.updateTask(id, updates);
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? updatedTask : task
          )
        );
        return updatedTask;
      } catch (err: any) {
        // Rollback optimistic update
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? previousTask : task
          )
        );
        const errorMessage = err?.error?.message || 'Failed to update task';
        setError(errorMessage);
        throw err;
      }
    },
    [tasks]
  );

  const toggleTask = useCallback(async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed } : task
      )
    );

    try {
      await tasksApi.toggleTask(id, completed);
    } catch (err: any) {
      // Rollback on error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );

      const errorMessage = err?.error?.message || 'Failed to toggle task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    // Optimistic removal
    const removedTask = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      await tasksApi.deleteTask(id);
    } catch (err: any) {
      // Rollback on error
      if (removedTask) {
        setTasks((prev) => [...prev, removedTask]);
      }

      const errorMessage = err?.error?.message || 'Failed to delete task';
      setError(errorMessage);
      throw err;
    }
  }, [tasks]);

  const refetch = useCallback(async () => {
    await getTasks();
  }, [getTasks]);

  return {
    tasks,
    loading,
    error,
    getTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    refetch,
  };
}
