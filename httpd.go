package main

import (
  "os"
  "github.com/gin-gonic/gin"
  "bufio"
  "math/rand"
  "time"
)

// Set numWords constant
const numWords int = 5000

func check(e error) {
  if e != nil {
    panic(e)
  }
}

func randChoice(arr [numWords]string) (string) {
  rand.Seed(time.Now().Unix())
  idx := rand.Intn(len(arr))
  return arr[idx]
}

func main() {
  // Create gin router
  r := gin.Default()

  // Create word array
  var words [numWords]string

  // Read from 5000-common-words.txt
  f, err := os.Open("5000-common-words.txt")
  check(err)
  scanner := bufio.NewScanner(f)
  scanner.Split(bufio.ScanLines)

  // Fetch words
  for i := 0; i < numWords; i++ {
    scanner.Scan()
    words[i] = scanner.Text()
  }

  /* Begin routes */

  // Index
  r.GET("/", func(c *gin.Context) {
    c.String(200, "index")
  })

  // Random word
  r.GET("/randword", func(c *gin.Context) {
    myWord := randChoice(words)
    c.String(200, myWord)
  })

  /* End routes */

  // Run server
  port := os.Getenv("PORT")
  if port == "" {
    port = "8000"
  }
  r.Run(":" + port)
}
