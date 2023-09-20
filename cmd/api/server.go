package main

import (
	"fmt"
	"log"
	"net/http"
)

func (app *application) serve() error {
	srv := http.Server{
		Addr:    fmt.Sprintf(":%d", app.config.port),
		Handler: app.routes(),
	}

	log.Println("starting server")

	err := srv.ListenAndServe()
	if err != nil {
		return err
	}

	return nil
}
