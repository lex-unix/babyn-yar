package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

func (app *application) createDevConceptHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string    `json:"title"`
		Description string    `json:"description"`
		Content     string    `json:"content"`
		Lang        string    `json:"lang"`
		Cover       string    `json:"cover"`
		OccuredOn   time.Time `json:"occuredOn"`
	}

	err := app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	concept := &data.DevConcept{
		Title:       input.Title,
		Description: input.Description,
		Content:     input.Content,
		Lang:        input.Lang,
		Cover:       input.Cover,
		OccuredOn:   input.OccuredOn,
		UserID:      user.ID,
	}

	v := validator.New()

	if data.ValidateDevConcept(v, concept); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.DevConcepts.Insert(concept)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/concepts/%d", concept.ID))

	err = app.writeJson(w, http.StatusCreated, envelope{"concept": concept}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listDevConceptsHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title string
		Lang  string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Title = app.readString(qs, "title", "")
	input.Lang = app.readString(qs, "lang", "")

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 10, v)

	input.Filters.Sort = app.readString(qs, "sort", "-created_at")
	input.Filters.SortSafelist = []string{"created_at", "-created_at", "occured_on", "-occured_on"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	concepts, metadata, err := app.models.DevConcepts.GetAll(input.Title, input.Lang, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"concepts": concepts, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteDevConceptsHandler(w http.ResponseWriter, r *http.Request) {
	v := validator.New()

	qs := r.URL.Query()

	ids := app.readIntList(qs, "ids", v)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err := app.models.DevConcepts.DeleteMultiple(ids)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "concepts successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showDevConceptHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	concept, err := app.models.DevConcepts.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"concept": concept}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateDevConceptHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	concept, err := app.models.DevConcepts.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	var input struct {
		Title       *string    `json:"title"`
		Description *string    `json:"description"`
		Content     *string    `json:"content"`
		Lang        *string    `json:"lang"`
		Cover       *string    `json:"cover"`
		OccuredOn   *time.Time `json:"occuredOn"`
	}

	err = app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Title != nil {
		concept.Title = *input.Title
	}

	if input.Description != nil {
		concept.Description = *input.Description
	}

	if input.Content != nil {
		concept.Content = *input.Content
	}

	if input.Lang != nil {
		concept.Lang = *input.Lang
	}

	if input.Cover != nil {
		concept.Cover = *input.Cover
	}

	if input.OccuredOn != nil {
		concept.OccuredOn = *input.OccuredOn
	}

	v := validator.New()

	if data.ValidateDevConcept(v, concept); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.DevConcepts.Update(concept)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			app.editConflictResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"concept": concept}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
