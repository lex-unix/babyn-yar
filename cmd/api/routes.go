package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (app *application) routes() http.Handler {
	router := chi.NewRouter()

	router.Get("/v1/healthcheck", app.healthcheckHandler)

	router.Get("/v1/victims", app.listVictimsHandler)

	return router
}
