import React, { useEffect, useState } from 'react';
import { Task } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskFormProps {
  task?: Task | null; // Existing task when editing, null when creating new
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isProcessing = false }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState<'Pending' | 'In-Progress' | 'Completed'>('Pending');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formError, setFormError] = React.useState('');
  const { toast } = useToast();

  useEffect(() => {
    // If editing an existing task, populate form fields
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      // Format date for input if exists
      if (task.due_date) {
        setDate(new Date(task.due_date));
      } else {
        setDate(undefined);
      }
    } else {
      // Reset form when creating a new task
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setDate(undefined);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validate form
    if (!title.trim()) {
      setFormError('Task title is required');
      toast({
        title: "Validation Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }

    // Prepare the task object
    const taskData: Task = {
      ...task, // Include existing data if editing
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      due_date: date ? date.toISOString() : undefined,
    };

    onSubmit(taskData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value: 'Pending' | 'In-Progress' | 'Completed') => setStatus(value)}>
            <SelectTrigger id="status" className="transition-all duration-200 focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In-Progress">In-Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date (optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                id="dueDate"
                className={cn(
                  "w-full justify-start text-left font-normal transition-all duration-200",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {formError && (
        <motion.p 
          className="text-sm text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formError}
        </motion.p>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="transition-all duration-200 hover:bg-secondary"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isProcessing}
          className="transition-all duration-200 hover:bg-primary/90"
        >
          {isProcessing ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </motion.form>
  );
};

export default TaskForm;
