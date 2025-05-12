package main

import (
	"log"
	"os"
	"time"

	"taskmanager/config"
	"taskmanager/models"
	"taskmanager/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db := config.SetupDB()

	// Auto migrate the schema
	db.AutoMigrate(&models.Task{})

	// Create a default gin router with Logger and Recovery middleware
	r := gin.Default()

	// Get allowed origins from env or use default
	allowedOrigins := []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:8080"}
	if origin := os.Getenv("ALLOWED_ORIGIN"); origin != "" {
		allowedOrigins = []string{origin}
	}

	// Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Setup API routes
	routes.SetupRoutes(r)

	// Get port from env or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
