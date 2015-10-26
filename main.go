package main

import (
  "fmt"
  "os"
  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/contrib/static"
  "bufio"
  "math/rand"
  "strconv"
)

// Set numWords constant
const numWords int = 5000

func check(e error) {
  if e != nil {
    panic(e)
  }
}

func randChoice(arr [numWords]string) (string) {
  idx := rand.Intn(len(arr))
  return arr[idx]
}

func main() {
  // Create gin router
  r := gin.Default()

  // Setup router
  r.Use(static.Serve("/", static.LocalFile("public", false)))

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

  // Random words
  r.GET("/randwords", func(c *gin.Context) {
    num, err := strconv.Atoi(c.DefaultQuery("num", "4"))
    if err != nil {
      fmt.Println("Atoi failed for " + c.Query("num"))
      c.String(400, "Bad Request: Num paramenter was not an integer.")
    } else if num <= 0 {
      c.String(400, "Bad Request: Num parameter must be positive.")
    } else {
      // Dynamic array allocation
      var myWords []string
      myWords = make([]string, num)
      for i, _ := range myWords {
        myWords[i] = randChoice(words)
      }
      c.JSON(200, gin.H{"words": myWords})
    }
  })

  /* End routes */

  // Run server
  port := os.Getenv("PORT")
  if port == "" {
    port = "8000"
  }
  r.Run(":" + port)
}
