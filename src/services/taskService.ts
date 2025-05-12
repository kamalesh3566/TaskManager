// This file contains the API service for tasks
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

// Task interface
export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: 'Pending' | 'In-Progress' | 'Completed';
  due_date?: string; // ISO string format
  created_at?: string;
  updated_at?: string;
}

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Service hook for managing tasks
export function useTasksService() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check API connectivity
  useEffect(() => {
    const checkApiConnectivity = async () => {
      try {
        await axios.get(`${API_BASE_URL}/health`);
      } catch (err) {
        console.warn('API server may be offline or not reachable. Using local state only.');
        // Initialize with some sample tasks if API is unreachable
        setTasks([
          {
            id: 1,
            title: "Sample Task",
            description: "This is a sample task (API server offline)",
            status: "Pending",
            due_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
          }
        ]);
      }
    };
    checkApiConnectivity();
  }, []);

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      console.log('Fetching tasks from:', API_BASE_URL);
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      console.log('Tasks response:', response.data);
      setTasks(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please try again.');
      
      // Display toast for error
      toast({
        title: "Connection Error",
        description: "Could not connect to the task server. Using local storage for now.",
        variant: "destructive",
      });
      
      // Use local storage as fallback
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (task: Task) => {
    setLoading(true);
    try {
      console.log('Creating task:', task);
      const response = await axios.post(`${API_BASE_URL}/tasks`, task);
      console.log('Create task response:', response.data);
      
      // Update task list with the new task at the beginning
      const newTask = response.data;
      setTasks(prevTasks => [newTask, ...prevTasks]);
      
      // Update local storage
      localStorage.setItem('tasks', JSON.stringify([newTask, ...tasks]));
      
      setError(null);
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
      
      // Create task locally if API fails
      const newTask = {
        ...task,
        id: Date.now(), // Generate a temporary ID
        created_at: new Date().toISOString(),
      };
      
      setTasks(prevTasks => [newTask, ...prevTasks]);
      localStorage.setItem('tasks', JSON.stringify([newTask, ...tasks]));
      
      toast({
        title: "Task Created Locally",
        description: "Task was saved locally due to server connection issues.",
        variant: "default",
      });
      
      return newTask;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (id: number, task: Partial<Task>) => {
    setLoading(true);
    try {
      console.log(`Updating task #${id}:`, task);
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, task);
      console.log('Update task response:', response.data);
      
      // Update the tasks array with the updated task
      const updatedTask = response.data;
      const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t);
      setTasks(updatedTasks);
      
      // Update local storage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      setError(null);
      return updatedTask;
    } catch (err) {
      console.error(`Error updating task #${id}:`, err);
      setError(`Failed to update task #${id}. Please try again.`);
      
      // Update task locally if API fails
      const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...task, updated_at: new Date().toISOString() } : t);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      toast({
        title: "Task Updated Locally",
        description: "Task was updated locally due to server connection issues.",
        variant: "default",
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    setLoading(true);
    try {
      console.log(`Deleting task #${id}`);
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      console.log(`Task #${id} deleted successfully`);
      
      // Remove the deleted task from the tasks array
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      
      // Update local storage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      setError(null);
    } catch (err) {
      console.error(`Error deleting task #${id}:`, err);
      setError(`Failed to delete task #${id}. Please try again.`);
      
      // Remove task locally if API fails
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      toast({
        title: "Task Deleted Locally",
        description: "Task was removed locally due to server connection issues.",
        variant: "default",
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}
