'use client';

import { Container } from '@/components/layout/Container';
import { EmptyState } from '@/components/layout/EmptyState';
import { Button } from '@/components/ui/Button';

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { TaskList } from '@/components/tasks/TaskList';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/lib/types';
import { DeleteConfirmDialog } from '@/components/tasks/DeleteConfirmDialog';

export default function DashboardPage() {
  const router = useRouter();
  const { tasks, loading, error: tasksError, createTask, updateTask, toggleTask, deleteTask } = useTasks();
  const { isAuthenticated } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  const handleToggleComplete = useCallback((id: string, completed: boolean) => {
      toggleTask(id, completed);
  }, [toggleTask]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
    setEditError(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    // Stub for US5 - delete functionality will be implemented later
  }, []);

  const handleCreateTask = useCallback(async (title: string, description: string) => {
    setCreating(true);
    setCreateError(null);
    try {
      await createTask(title, description);
      setShowCreateModal(false);
    } catch (err: any) {
      setCreateError(err?.error?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  }, [createTask]);

  const handleUpdateTask = useCallback(async (title: string, description: string) => {
    if (!editingTask) return;
    setEditing(true);
    setEditError(null);
    try {
      await updateTask(editingTask.id, { title, description });
      setShowEditModal(false);
      setEditingTask(null);
    } catch (err: any) {
      setEditError(err?.error?.message || 'Failed to update task');
    } finally {
      setEditing(false);
    }
  }, [editingTask, updateTask]);

  const handleConfirmDelete = useCallback(async () =&gt; {
    if (!taskToDeleteId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTask(taskToDeleteId);
      setShowDeleteModal(false);
      setTaskToDeleteId(null);
    } catch (err: any) {
      setDeleteError(err?.error?.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  }, [taskToDeleteId, deleteTask]);

  const handleCancelDelete = useCallback(() =&gt; {
    setShowDeleteModal(false);
    setTaskToDeleteId(null);
    setDeleteError(null);
  }, []);

  if (typeof isAuthenticated === 'undefined') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Container className="py-8">
      <TaskList
        tasks={tasks}
        loading={loading}
        error={tasksError}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateTask={() => setShowCreateModal(true)}
      />
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreateError(null);
        }}
        title="Create New Task"
      >
        <TaskForm
          mode="create"
          onSave={handleCreateTask}
          onCancel={() => {
            setShowCreateModal(false);
            setCreateError(null);
          }}
          loading={creating}
          error={createError}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
          setEditError(null);
        }}
        title="Edit Task"
      >
        <TaskForm
          mode="edit"
          task={editingTask || undefined}
          onSave={handleUpdateTask}
          onCancel={() => {
            setShowEditModal(false);
            setEditingTask(null);
            setEditError(null);
          }}
          loading={editing}
          error={editError}
        />
      </Modal>
    </Container>
  );
}

