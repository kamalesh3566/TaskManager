import React from 'react';
import { cn } from '@/lib/utils';

type TaskStatus = 'Pending' | 'In-Progress' | 'Completed';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'In-Progress':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusStyles(),
        className
      )}
    >
      {status}
    </span>
  );
};

export default TaskStatusBadge;