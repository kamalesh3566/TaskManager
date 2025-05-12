import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { Task } from '@/services/taskService';
import { motion } from 'framer-motion';

interface TaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  task?: Task | null;
  isProcessing: boolean;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  isProcessing,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Update your task details below.'
              : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={task}
          onSubmit={onSubmit}
          onCancel={onClose}
          isProcessing={isProcessing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
