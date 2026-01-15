'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Task } from '@/lib/types';

interface TaskFormProps {
  mode: 'create' | 'edit';
  task?: Task;
  onSave: (title: string, description: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export function TaskForm({
  mode = 'create',
  task,
  onSave,
  onCancel,
  loading = false,
  error = null,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [formError, setFormError] = useState('');

  const defaultTitle = task?.title || '';
  const defaultDescription = task?.description || '';

  useEffect(() => {
    setTitle(defaultTitle);
    setDescription(defaultDescription || '');
    setTitleError('');
    setFormError('');
  }, [defaultTitle, defaultDescription]);

  const validateForm = (): boolean => {
    setTitleError('');
    setFormError('');

    if (!title.trim()) {
      setTitleError('Title is required');
      return false;
    }

    if (title.length > 100) {
      setTitleError('Title must be 100 characters or less');
      return false;
    }

    if (description && description.length > 500) {
      setFormError('Description must be 500 characters or less');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSave(title, description);
    } catch (err) {
      setFormError('Failed to save task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
          placeholder="Enter task title"
          maxLength={100}
          required
        />
      </div>

      <div>
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          maxLength={500}
          rows={4}
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading || !title.trim()}>
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Saving...
            </>
          ) : mode === 'create' ? (
            'Create Task'
          ) : (
            'Update Task'
          )}
        </Button>
      </div>
    </form>
  );
}