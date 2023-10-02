package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func (app *application) routes() http.Handler {
	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	router.Get("/v1/healthcheck", app.healthcheckHandler)

	router.Get("/v1/victims", app.listVictimsHandler)

	// events
	router.Get("/v1/events", app.listEventsHandler)
	router.Get("/v1/events/{id}", app.showEventHandler)
	router.Post("/v1/events", app.createEventHandler)
	router.Patch("/v1/events/{id}", app.updateEventHandler)

	// assets
	router.Get("/v1/assets", app.listAssetsHandler)
	router.Post("/v1/assets", app.createAssetsHandler)

	return router
}
