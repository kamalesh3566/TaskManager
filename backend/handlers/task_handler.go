package handlers

import (
	"net/http"
	"strconv"
	"time"

	"taskmanager/config"
	"taskmanager/models"

	"github.com/gin-gonic/gin"
)

// GetTasks handles the GET request to fetch all tasks
func GetTasks(c *gin.Context) {
	db := config.GetDB()

	var tasks []models.Task
	result := db.Order("created_at desc").Find(&tasks)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// GetTaskByID handles the GET request to fetch a task by ID
func GetTaskByID(c *gin.Context) {
	db := config.GetDB()

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var task models.Task
	result := db.First(&task, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, task)
}

// CreateTask handles the POST request to create a new task
func CreateTask(c *gin.Context) {
	db := config.GetDB()

	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set default status if not provided
	if task.Status == "" {
		task.Status = "Pending"
	}

	// Parse and validate due date if provided
	if c.PostForm("due_date") != "" {
		dueDate, err := time.Parse(time.RFC3339, c.PostForm("due_date"))
		if err == nil {
			task.DueDate = &dueDate
		}
	}

	result := db.Create(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

// UpdateTask handles the PUT request to update an existing task
func UpdateTask(c *gin.Context) {
	db := config.GetDB()

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var existingTask models.Task
	result := db.First(&existingTask, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var updatedTask models.Task
	if err := c.ShouldBindJSON(&updatedTask); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	existingTask.Title = updatedTask.Title
	existingTask.Description = updatedTask.Description
	existingTask.Status = updatedTask.Status
	existingTask.DueDate = updatedTask.DueDate

	result = db.Save(&existingTask)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}

	c.JSON(http.StatusOK, existingTask)
}

// DeleteTask handles the DELETE request to remove a task
func DeleteTask(c *gin.Context) {
	db := config.GetDB()

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var task models.Task
	result := db.First(&task, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	db.Delete(&task)

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}
