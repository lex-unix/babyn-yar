package main

import (
	"flag"
	"log"
)

const version = "1.0.0"

type config struct {
	port int
	env  string
}

type application struct {
	config config
}

func main() {
	var cfg config

	// app
	flag.IntVar(&cfg.port, "port", 8000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")

	flag.Parse()

	app := &application{
		config: cfg,
	}

	err := app.serve()
	if err != nil {
		log.Fatal(err)
	}
}
