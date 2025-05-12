# Task Manager Backend

This is the Go backend for the Task Manager application using the Gin framework and SQLite database.

## Directory Structure

- `main.go`: Entry point for the application
- `config/`: Database configuration
- `models/`: Data models and database schema
- `handlers/`: HTTP request handlers
- `routes/`: API route definitions
- `migrations/`: SQL migration scripts

## Setup and Run

1. Install Go (version 1.19 or later)
2. Install dependencies:
   ```
   go mod tidy
   ```
3. Run the server:
   ```
   go run main.go
   ```

The server will start on `http://localhost:8080`.

## API Endpoints

- `GET /api/tasks`: Get all tasks
- `POST /api/tasks`: Create a new task
- `GET /api/tasks/:id`: Get a task by ID
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task

## Task Model

```go
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
```
