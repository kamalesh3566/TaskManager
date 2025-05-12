import React from 'react';
import { Task } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import TaskStatusBadge from './TaskStatusBadge';
import { format } from 'date-fns';
import { Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Invalid date format:', error);
      return 'Invalid date';
    }
  };

  // Function to determine if task is overdue
  const isOverdue = () => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    return dueDate < today && task.status !== 'Completed';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300",
        task.status === 'Completed' ? "opacity-75" : "",
        isOverdue() ? "border-red-300" : ""
      )}>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold break-words pr-2">{task.title}</CardTitle>
            <TaskStatusBadge status={task.status} />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          {task.description && (
            <motion.p 
              className="text-sm text-gray-600 dark:text-gray-300 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {task.description}
            </motion.p>
          )}
          {task.due_date && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "text-xs font-medium",
                isOverdue() ? "text-red-500" : "text-gray-500 dark:text-gray-400"
              )}
            >
              Due: {formatDate(task.due_date)}
              {isOverdue() && ' (Overdue)'}
            </motion.p>
          )}
        </CardContent>
        <CardFooter className="p-2 pt-0 bg-gray-50 dark:bg-gray-800 flex justify-end gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(task)}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (task.id) onDelete(task.id);
              }}
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TaskItem;