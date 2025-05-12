import React, { useState, useEffect } from 'react';
import { useTasksService, Task } from '@/services/taskService';
import TaskList from './TaskList';
import TaskFormDialog from './TaskFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TaskManager: React.FC = () => {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasksService();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Show error toast if API error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Handle opening form dialog for creating new task
  const handleCreateTask = () => {
    setCurrentTask(null);
    setIsFormDialogOpen(true);
  };

  // Handle opening form dialog for editing task
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsFormDialogOpen(true);
  };

  // Handle opening delete confirmation dialog
  const handleDeletePrompt = (id: number) => {
    setTaskToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle task form submission (create or update)
  const handleTaskSubmit = async (task: Task) => {
    setIsProcessing(true);
    try {
      if (task.id) {
        // Update existing task
        await updateTask(task.id, task);
        toast({
          title: 'Task updated',
          description: 'Your task has been updated successfully.',
        });
      } else {
        // Create new task
        await createTask(task);
        toast({
          title: 'Task created',
          description: 'Your new task has been created successfully.',
        });
      }
      setIsFormDialogOpen(false);
    } catch (err) {
      // Error is handled by service and displayed as toast
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle task deletion
  const handleDeleteConfirm = async () => {
    if (taskToDeleteId === null) return;
    
    setIsProcessing(true);
    try {
      await deleteTask(taskToDeleteId);
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Task deleted',
        description: 'The task has been deleted successfully.',
      });
    } catch (err) {
      // Error is handled by service and displayed as toast
    } finally {
      setIsProcessing(false);
      setTaskToDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <Button onClick={handleCreateTask} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      {/* Task List */}
      <TaskList 
        tasks={tasks}
        loading={loading}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeletePrompt}
      />

      {/* Task Form Dialog */}
      <TaskFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        onSubmit={handleTaskSubmit}
        task={currentTask}
        isProcessing={isProcessing}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isProcessing}
        taskId={taskToDeleteId}
      />
    </div>
  );
};

export default TaskManager;