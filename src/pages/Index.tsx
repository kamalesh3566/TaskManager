import React from 'react';
import TaskManager from '@/components/TaskManager';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const Index = () => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-background text-foreground transition-colors duration-500"
    >
      <div className="container py-8">
        <motion.div 
          className="flex justify-end mb-4"
          variants={itemVariants}
        >
          <ThemeToggle />
        </motion.div>
        
        <motion.div 
          className="bg-card text-card-foreground shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl"
          variants={itemVariants}
        >
          <TaskManager />
        </motion.div>
        
        <motion.footer 
          className="mt-8 text-center text-sm text-muted-foreground"
          variants={itemVariants}
        >
          <p>Task Manager Application &copy; {new Date().getFullYear()}</p>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default Index;
