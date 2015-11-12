package main

import (
	"bufio"
	"encoding/json"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"math/rand"
	"os"
	"strconv"
	"text/template"
	"time"
)

// Set numWords constant
const numWords int = 5000

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func randChoice(arr [numWords]string) string {
	idx := rand.Intn(len(arr))
	return arr[idx]
}

func extendJSON(target map[string]interface{}, extension map[string]interface{}) map[string]interface{} {
	var resultSlice map[string]interface{} = make(map[string]interface{}, len(target)+len(extension))
	for k, v := range target {
		resultSlice[k] = v
	}
	for k, v := range extension {
		resultSlice[k] = v
	}
	return resultSlice
}

func main() {
	// Seed random number generator
	rand.Seed(time.Now().UnixNano())

	// Create gin router
	r := gin.Default()

	// Setup router
	r.Use(static.Serve("/", static.LocalFile("public", false)))

	// Read data files
	var e error
	var data []byte
	var delimiters, prefixes, suffixes map[string]interface{}
	data, e = ioutil.ReadFile("public/data/delimiters.json")
	check(e)
	e = json.Unmarshal(data, &delimiters)
	check(e)
	data, e = ioutil.ReadFile("public/data/prefixes.json")
	check(e)
	e = json.Unmarshal(data, &prefixes)
	check(e)
	prefixes = extendJSON(prefixes, delimiters)
	data, e = ioutil.ReadFile("public/data/suffixes.json")
	check(e)
	e = json.Unmarshal(data, &suffixes)
	suffixes = extendJSON(suffixes, delimiters)

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
		tmpl, err := template.ParseFiles("templates/layouts/index.html", "templates/partials/head.html",
			"templates/partials/index.html", "templates/partials/footer.html")
		if err != nil {
			c.String(500, "Internal Server Error: Error parsing templates")
			return
		}

		contextObj := gin.H{"title": "EZ Password Generator"}

		err = tmpl.Execute(c.Writer, contextObj)
		if err != nil {
			c.String(500, "Internal Server Error: Error executing compiled template")
			return
		}
	})

	// Random words
	r.GET("/randwords", func(c *gin.Context) {
		num, err := strconv.Atoi(c.DefaultQuery("num", "4"))

		if err != nil {
			c.String(400, "Bad Request: Num paramenter was not an integer.")
			return
		}
		if num <= 0 {
			c.String(400, "Bad Request: Num parameter must be positive.")
			return
		}

		// Dynamic array allocation
		var myWords []string
		myWords = make([]string, num)

		for i, _ := range myWords {
			myWords[i] = randChoice(words)
		}

		c.JSON(200, gin.H{"words": myWords})
	})

	r.GET("/delimiters", func(c *gin.Context) {
		c.JSON(200, gin.H(delimiters))
	})

	r.GET("/prefixes", func(c *gin.Context) {
		c.JSON(200, gin.H(prefixes))
	})

	r.GET("/suffixes", func(c *gin.Context) {
		c.JSON(200, gin.H(suffixes))
	})

	r.GET("/characters", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"delimiters": delimiters,
			"prefixes":   prefixes,
			"suffixes":   suffixes,
		})
	})

	r.GET("/about", func(c *gin.Context) {
		tmpl, err := template.ParseFiles("templates/layouts/index.html", "templates/partials/head.html",
			"templates/partials/about.html", "templates/partials/footer.html")
		if err != nil {
			c.String(500, "Internal Server Error: Error parsing templates")
			return
		}

		contextObj := gin.H{"title": "EZ Password Generator"}

		err = tmpl.Execute(c.Writer, contextObj)
		if err != nil {
			c.String(500, "Internal Server Error: Error executing compiled template")
			return
		}
	})

	r.GET("/terms", func(c *gin.Context) {
		tmpl, err := template.ParseFiles("templates/layouts/index.html", "templates/partials/head.html",
			"templates/partials/terms.html", "templates/partials/footer.html")
		if err != nil {
			c.String(500, "Internal Server Error: Error parsing templates")
			return
		}

		contextObj := gin.H{"title": "EZ Password Generator"}

		err = tmpl.Execute(c.Writer, contextObj)
		if err != nil {
			c.String(500, "Internal Server Error: Error executing compiled template")
			return
		}
	})

	r.GET("/github", func(c *gin.Context) {
		c.Redirect(301, "https://github.com/andrewyang96/GoPasswordGenerator")
	})

	/* End routes */

	// Run server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	r.Run(":" + port)
}
