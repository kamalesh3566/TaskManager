package models

import (
	"time"

	"gorm.io/gorm"
)

// Task represents the task model in the database
type Task struct {
	ID          uint           `json:"id" gorm:"primarykey"`
	Title       string         `json:"title" binding:"required" gorm:"not null"`
	Description string         `json:"description"`
	Status      string         `json:"status" binding:"required,oneof=Pending In-Progress Completed" gorm:"not null;default:Pending"`
	DueDate     *time.Time     `json:"due_date"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}
