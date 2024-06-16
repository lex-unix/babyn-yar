package main

import (
	"errors"
	"net/http"

	"github.com/lex-unix/babyn-yar/internal/data"
)

func (app *application) listGalleryImagesHandler(w http.ResponseWriter, r *http.Request) {
	imgs, err := app.models.GalleryImages.GetAll()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"images": imgs}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) createGalleryImageHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		ID  int64  `json:"id"`
		URL string `json:"url"`
	}

	err := app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	img := &data.GalleryImage{
		ID:  input.ID,
		URL: input.URL,
	}

	err = app.models.GalleryImages.Insert(img)

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusCreated, envelope{"image": img}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteGalleryImageHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.GalleryImages.Delete(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "image successfuly deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
