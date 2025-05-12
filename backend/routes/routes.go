package routes

import (
	"taskmanager/handlers"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures the API routes
func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// Health endpoint
		api.GET("/health", handlers.HealthCheck)

		// Task endpoints
		api.GET("/tasks", handlers.GetTasks)
		api.GET("/tasks/:id", handlers.GetTaskByID)
		api.POST("/tasks", handlers.CreateTask)
		api.PUT("/tasks/:id", handlers.UpdateTask)
		api.DELETE("/tasks/:id", handlers.DeleteTask)
	}
}
