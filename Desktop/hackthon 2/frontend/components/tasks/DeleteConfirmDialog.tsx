'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface DeleteConfirmDialogProps {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

export function DeleteConfirmDialog({
  taskTitle,
  onConfirm,
  onCancel,
  loading,
  error,
}: DeleteConfirmDialogProps) {
  return (
    <div className="p-6 space-y-4">
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task</h3>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-medium text-gray-900">&quot;{taskTitle}&quot;</span>?
          This action cannot be undone.
        </p>
      </div>
      {error && (
        <ErrorMessage message={error} />
      )}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner className="h-4 w-4" />
              Deleting...
            </>
          ) : (
            'Delete Task'
          )}
        </Button>
      </div>
    </div>
  );
}
