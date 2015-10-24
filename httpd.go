package main

import (
  "os"
  "github.com/gin-gonic/gin"
)

func main() {
  // Create gin router
  r := gin.Default()

  /* Begin routes */

  // Index
  r.GET("/", func(c *gin.Context) {
    c.String(200, "index")
  })

  // Ping
  r.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  /* End routes */

  // Run server
  port := os.Getenv("PORT")
  if port == "" {
    port = "8000"
  }
  r.Run(":" + port)
}
