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
	router.Delete("/v1/assets", app.requireAuthenticatedUser(app.deleteAssetsHandler))

	// users
	router.Post("/v1/users/register", app.requirePermission("admin", app.registerUserHandler))
	router.Post("/v1/users/login", app.loginUserHandler)
	router.Get("/v1/users/me", app.requireAuthenticatedUser(app.meHandler))
	router.Get("/v1/users", app.requirePermission("admin", app.listUsersHandler))
	router.Patch("/v1/users", app.requireAuthenticatedUser(app.updateUserHandler))
	router.Delete("/v1/users", app.requirePermission("admin", app.deleteUsersHandler))

	// victim testimonies
	router.Post("/v1/victim-testimonies", app.requirePermission("admin", app.createTestimonyHandler))
	router.Get("/v1/victim-testimonies", app.listTestimoniesHandler)
	router.Get("/v1/victim-testimonies/{id}", app.showTestimonyHandler)
	router.Patch("/v1/victim-testimonies/{id}", app.requireAuthenticatedUser(app.updateTestimonyHandler))
	router.Delete("/v1/victim-testimonies", app.requireAuthenticatedUser(app.deleteTestimoniesHandler))

	// books
	router.Get("/v1/books", app.listBooksHandler)
	router.Get("/v1/books/{id}", app.showBookHandler)
	router.Post("/v1/books", app.requireAuthenticatedUser(app.createBookHandler))
	router.Patch("/v1/books/{id}", app.requireAuthenticatedUser(app.updateBookHandler))
	router.Delete("/v1/books", app.requireAuthenticatedUser(app.deleteBooksHandler))

	// holocaust documents
	router.Get("/v1/holocaust-documents", app.listHolocaustDocumentsHandler)
	router.Get("/v1/holocaust-documents/{id}", app.showHolocaustDocumentHandler)
	router.Post("/v1/holocaust-documents", app.requireAuthenticatedUser(app.createHolocaustDocumentHandler))
	router.Patch("/v1/holocaust-documents/{id}", app.requireAuthenticatedUser(app.updateHolocaustDocumentHandler))
	router.Delete("/v1/holocaust-documents", app.requireAuthenticatedUser(app.deleteHolocaustDocumentsHandler))

	// media articles
	router.Get("/v1/media-articles", app.listMediaArticlesHandler)
	router.Get("/v1/media-articles/{id}", app.showMediaArticleHandler)
	router.Post("/v1/media-articles", app.requireAuthenticatedUser(app.createMediaArticleHandler))
	router.Patch("/v1/media-articles/{id}", app.requireAuthenticatedUser(app.updateMediaArticleHandler))
	router.Delete("/v1/media-articles", app.requireAuthenticatedUser(app.deleteMediaArticlesHandler))

	// gallery
	router.Get("/v1/gallery", app.listGalleryImagesHandler)
	router.Post("/v1/gallery", app.requireAuthenticatedUser(app.createGalleryImageHandler))
	router.Delete("/v1/gallery/{id}", app.requireAuthenticatedUser(app.deleteGalleryImageHandler))

	// partners
	router.Get("/v1/partners", app.listPartnersHandler)
	router.Get("/v1/partners/{id}", app.showPartnerHandler)
	router.Post("/v1/partners", app.requireAuthenticatedUser(app.createPartnerHandler))
	router.Patch("/v1/partners/{id}", app.requireAuthenticatedUser(app.updatePartnerHandler))
	router.Delete("/v1/partners", app.requireAuthenticatedUser(app.deletePartnersHandler))

	// legal documents
	router.Get("/v1/legal-documents", app.listLegalDocumentsHandler)
	router.Get("/v1/legal-documents/{id}", app.showLegalDocumentHandler)
	router.Post("/v1/legal-documents", app.requireAuthenticatedUser(app.createLegalDocumentHandler))
	router.Patch("/v1/legal-documents/{id}", app.requireAuthenticatedUser(app.updateLegalDocumentHandler))
	router.Delete("/v1/legal-documents", app.requireAuthenticatedUser(app.deleteLegalDocumentsHandler))

	// development concepts
	router.Get("/v1/development-concepts", app.listDevConceptsHandler)
	router.Get("/v1/development-concepts/{id}", app.showDevConceptHandler)
	router.Post("/v1/development-concepts", app.requireAuthenticatedUser(app.createDevConceptHandler))
	router.Patch("/v1/development-concepts/{id}", app.requireAuthenticatedUser(app.updateDevConceptHandler))
	router.Delete("/v1/development-concepts", app.requireAuthenticatedUser(app.deleteDevConceptsHandler))

	return router
}
