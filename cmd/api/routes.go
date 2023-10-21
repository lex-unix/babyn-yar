package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (app *application) routes() http.Handler {
	router := chi.NewRouter()

	router.Use(app.enableCORS())
	router.Use(app.authenticate)

	router.Get("/v1/healthcheck", app.healthcheckHandler)

	router.Get("/v1/victims", app.listVictimsHandler)

	// events
	router.Get("/v1/events", app.listEventsHandler)
	router.Get("/v1/events/{id}", app.showEventHandler)
	router.Post("/v1/events", app.requireAuthenticatedUser(app.createEventHandler))
	router.Patch("/v1/events/{id}", app.requireAuthenticatedUser(app.updateEventHandler))
	router.Delete("/v1/events", app.requireAuthenticatedUser(app.deleteEventsHandler))

	// assets
	router.Get("/v1/assets", app.requireAuthenticatedUser(app.listAssetsHandler))
	router.Post("/v1/assets", app.requireAuthenticatedUser(app.createAssetsHandler))

	// users
	router.Post("/v1/users/register", app.requirePermission("admin", app.registerUserHandler))
	router.Post("/v1/users/login", app.loginUserHandler)
	router.Get("/v1/users/me", app.requireAuthenticatedUser(app.meHandler))
	router.Get("/v1/users", app.requirePermission("admin", app.listUsersHandler))
	router.Patch("/v1/users", app.requireAuthenticatedUser(app.updateUserHandler))
	router.Delete("/v1/users", app.requirePermission("admin", app.deleteUsersHandler))

	return router
}
