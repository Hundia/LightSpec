package main

import "github.com/labstack/echo/v4"

func main() {
    e := echo.New()
    e.GET("/items", getItems)
    e.POST("/items", createItem)
    e.Start(":8080")
}
