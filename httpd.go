package main

import (
  "os"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Routes
  r.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  // Run server
  port := os.Getenv("PORT")
  if port == "" {
    port = "8000"
  }
  r.Run(":" + port)
}
