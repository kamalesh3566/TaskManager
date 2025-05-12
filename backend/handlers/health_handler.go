package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthCheck handles the GET request to check API health
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"message": "API is operational",
	})
}
